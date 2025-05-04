const { v4: uuidv4 } = require('uuid');
const Order = require('../models/order.js');
const StoreGames = require('../models/store.js');
const User = require('../models/users.js');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const mailController = require("./mail.controller.js")

const squareBaseUrl = 'https://connect.squareupsandbox.com/v2';
const squareVersion = '2025-04-16';

const paymentController = {
    // Create a new customer in Square
    createCustomer: catchAsync(async (req, res) => {
        try {
            const { firstName, lastName, email, addressLine1, addressLine2, city, state, postalCode, 
                   country, phoneNumber, referenceId, note } = req.body;

            // Validate required fields
            if (!firstName || !lastName || !email) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'First name, last name, and email are required'
                });
            }

            const response = await axios({
                method: 'POST',
                url: `${squareBaseUrl}/customers`,
                headers: {
                    'Square-Version': squareVersion,
                    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    given_name: firstName,
                    family_name: lastName,
                    email_address: email,
                    address: addressLine1 ? {
                        address_line_1: addressLine1,
                        address_line_2: addressLine2 || '',
                        locality: city || '',
                        administrative_district_level_1: state || '',
                        postal_code: postalCode || '',
                        country: country || 'US'
                    } : undefined,
                    phone_number: phoneNumber,
                    reference_id: referenceId || req.user.id,
                    note: note || 'Customer created through API'
                }
            });

            res.status(201).json({
                status: 'success',
                data: response.data
            });
        } catch (error) {
            console.error('Error creating Square customer:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                status: 'fail',
                message: error.response?.data?.errors?.[0]?.detail || 'Error creating customer'
            });
        }
    }),

    // Save a card for a customer
    saveCard: catchAsync(async (req, res) => {
        try {
            const { sourceId, customerId, cardholderName, addressLine1, addressLine2, city, 
                   state, postalCode, country, referenceId } = req.body;

            // Validate required fields
            if (!sourceId || !customerId) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Source ID and customer ID are required'
                });
            }

            const idempotencyKey = uuidv4();

            const response = await axios({
                method: 'POST',
                url: `${squareBaseUrl}/cards`,
                headers: {
                    'Square-Version': squareVersion,
                    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    idempotency_key: idempotencyKey,
                    source_id: sourceId,
                    card: {
                        billing_address: addressLine1 ? {
                            address_line_1: addressLine1,
                            address_line_2: addressLine2 || '',
                            locality: city || '',
                            administrative_district_level_1: state || '',
                            postal_code: postalCode || '',
                            country: country || 'US'
                        } : undefined,
                        cardholder_name: cardholderName,
                        customer_id: customerId,
                        reference_id: referenceId || req.user.id
                    }
                }
            });

            res.status(201).json({
                status: 'success',
                data: response.data
            });
        } catch (error) {
            console.error('Error saving card:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                status: 'fail',
                message: error.response?.data?.errors?.[0]?.detail || 'Error saving card'
            });
        }
    }),

    // Process a payment
    processPayment: catchAsync(async (req, res) => {
        try {
            const { 
                sourceId, 
                customerId, 
                amount, 
                currency = 'USD', 
                locationId, 
                referenceId,
                games,
                userId
            } = req.body;
    
            if (!sourceId || !amount) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Source ID and amount are required'
                });
            }
    
            const idempotencyKey = uuidv4();
            const transactionId = uuidv4();
    
            const paymentResponse = await axios({
                method: 'POST',
                url: `${squareBaseUrl}/payments`,
                headers: {
                    'Square-Version': squareVersion,
                    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    idempotency_key: idempotencyKey,
                    amount_money: {
                        amount: Math.round(amount * 100),
                        currency: currency
                    },
                    source_id: sourceId,
                    autocomplete: true,
                    customer_id: customerId,
                    location_id: locationId || process.env.SQUARE_LOCATION_ID,
                    reference_id: referenceId || transactionId
                }
            });
    
            let savedOrder = null;
    
            if (games && games.length > 0 && userId) {
                let gameDetails = await Promise.all(
                    games.map(async (game) => {
                        const gameInfo = await StoreGames.findById(game.gameId);
    
                        if (!gameInfo) throw new Error(`Game with ID ${game.gameId} not found`);
                        if (gameInfo.copies < game.quantity) {
                            throw new Error(`Not enough copies of ${gameInfo.name} available`);
                        }
    
                        const selectedKeys = [];
                        for (let i = 0; i < game.quantity; i++) {
                            const gameKey = gameInfo.gameKeys.pop();
                            if (!gameKey) {
                                throw new Error(`No game keys available for ${gameInfo.name}`);
                            }
                            selectedKeys.push(gameKey);
                        }
    
                        gameInfo.copies -= game.quantity;
                        await gameInfo.save();
    
                        return {
                            gameId: gameInfo._id,
                            title: gameInfo.name,
                            price: gameInfo.price,
                            quantity: game.quantity,
                            cover_url: gameInfo.cover_url,
                            genre: gameInfo.genres,
                            releaseDate: gameInfo.first_release_date,
                            gameKeys: selectedKeys,
                        };
                    })
                );
    
                const order = new Order({
                    user: userId,
                    games: gameDetails,
                    totalAmount: amount,
                    status: "Completed",
                    paymentInfo: {
                        method: "Square",
                        transactionId: paymentResponse.data.payment.id || transactionId
                    }
                });
    
                savedOrder = await order.save();
    
                // Send confirmation mail
                const user = await User.findById(userId);
                if (user && user.email) {
                    await mailController.purchaseConfirmation(user.email, gameDetails, paymentResponse.data.payment.id || transactionId);
                }
            }
    
            res.status(200).json({
                status: 'success',
                data: {
                    paymentDetails: paymentResponse.data,
                    transactionId: paymentResponse.data.payment.id || transactionId,
                    order: savedOrder  
                }
            });
        } catch (error) {
            console.error('Payment error:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                status: 'fail',
                message: error.response?.data?.errors?.[0]?.detail || 'Error processing payment'
            });
        }
    }),
    

    // Get a list of a customer's cards
    getCustomerCards: catchAsync(async (req, res) => {
        try {
            const { customerId } = req.params;

            if (!customerId) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Customer ID is required'
                });
            }

            const response = await axios({
                method: 'GET',
                url: `${squareBaseUrl}/customers/${customerId}/cards`,
                headers: {
                    'Square-Version': squareVersion,
                    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                }
            });

            res.status(200).json({
                status: 'success',
                data: response.data
            });
        } catch (error) {
            console.error('Error getting customer cards:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                status: 'fail',
                message: error.response?.data?.errors?.[0]?.detail || 'Error retrieving cards'
            });
        }
    }),

    // Get customer details
    getCustomer: catchAsync(async (req, res) => {
        try {
            const { customerId } = req.params;

            if (!customerId) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Customer ID is required'
                });
            }

            const response = await axios({
                method: 'GET',
                url: `${squareBaseUrl}/customers/${customerId}`,
                headers: {
                    'Square-Version': squareVersion,
                    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                }
            });

            res.status(200).json({
                status: 'success',
                data: response.data
            });
        } catch (error) {
            console.error('Error getting customer details:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                status: 'fail',
                message: error.response?.data?.errors?.[0]?.detail || 'Error retrieving customer'
            });
        }
    }),

    // Delete a card
    deleteCard: catchAsync(async (req, res) => {
        try {
            const { cardId } = req.params;

            if (!cardId) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Card ID is required'
                });
            }

            await axios({
                method: 'DELETE',
                url: `${squareBaseUrl}/cards/${cardId}`,
                headers: {
                    'Square-Version': squareVersion,
                    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                }
            });

            res.status(200).json({
                status: 'success',
                message: 'Card deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting card:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                status: 'fail',
                message: error.response?.data?.errors?.[0]?.detail || 'Error deleting card'
            });
        }
    }),

    // Get payment details
    getPayment: catchAsync(async (req, res) => {
        try {
            const { paymentId } = req.params;

            if (!paymentId) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Payment ID is required'
                });
            }

            const response = await axios({
                method: 'GET',
                url: `${squareBaseUrl}/payments/${paymentId}`,
                headers: {
                    'Square-Version': squareVersion,
                    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                }
            });

            res.status(200).json({
                status: 'success',
                data: response.data
            });
        } catch (error) {
            console.error('Error getting payment details:', error.response?.data || error.message);
            res.status(error.response?.status || 500).json({
                status: 'fail',
                message: error.response?.data?.errors?.[0]?.detail || 'Error retrieving payment'
            });
        }
    }),
};

module.exports = paymentController;