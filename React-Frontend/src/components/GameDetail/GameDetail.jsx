import React, { useState, useEffect } from 'react';
import { formatDescription } from '../../utils/funcs';
import {
    Card,
    CardBody,
    Stack,
    Heading,
    Image,
    AspectRatio,
    Center,
    Box,
    Flex,
    Text,
    Button,
    Badge,
    Divider,
    Select,
    Icon, HStack, VStack, SimpleGrid
} from "@chakra-ui/react";
import { FaSteam, FaPlaystation, FaXbox } from 'react-icons/fa';
import "../../styles/GameStoreAdmin.css";
import { fetchData } from '../../api/api-gamevault';
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Screenshots from '../screenshots';
import "../../styles/GameStoreAdmin.css";


const GameDetail = () => {

    const { id } = useParams();
    const [game, setGameData] = useState();
    const [screenshots, setScreenshots] = useState();
    const [isExpanded, setIsExpanded] = useState(false);
    const [description, setDescription] = useState("");

    const getGameData = async () => {
        try {
            const data = await fetchData(`games/get?id=${id}`);
            setGameData(data.queryResult);
            const images = data?.queryResult.images.slice(2);
            const urls = images.map(image => image.original);
            setScreenshots(urls);
            console.log("images: ", data?.queryResult.images);
            console.log("urls: ", urls);

            const fullDescription = formatDescription(data.queryResult.description);
            const truncatedDescription = formatDescription(fullDescription).slice(0, 500);
            setDescription(isExpanded ? fullDescription : truncatedDescription);
        } catch (error) {
            console.log("error fetching game data", error);
        }
    };

    useEffect(() => {
        getGameData();
    }, []);

    const handleToggle = () => {
        setIsExpanded(prev => !prev); // Toggle the state
        setDescription(isExpanded ? formatDescription(game.description).slice(0, 500) : formatDescription(game.description)); // Toggle description based on the state
    };


    return (<>
        {game ? (
            <>
                <Box
                    bg="gray.900"
                    color="white"
                    minHeight="100vh"
                    p={8}
                >
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap={8}
                    >
                        <Box flex={1} mr="50">
                            <Image
                                src={game.image?.original_url || '/placeholder.jpg'}
                                alt={game.name}
                                borderRadius="lg"
                                boxShadow="xl"
                                mb={4}
                            />
                            {game.platforms.map((platform, index) => (
                                < span
                                    className="span-text"
                                >
                                    <Button
                                        className="platform-button"
                                        onClick={(e) =>
                                            handleGenreClick(platform.name, false)
                                        }
                                    >
                                        {platform.name}
                                    </Button>

                                    {index < game.platforms.length - 1 ? " " : ""}
                                </span>
                            ))}
                        </Box>

                        <VStack
                            flex={2}
                            align="start"
                            spacing={10}

                        >

                            <h1 className="text-5xl font-bold" >{game.name}</h1>

                            <HStack spacing={4}>
                                <Text className='text-lg font-bold'>Released: {game.releaseDate || "---"}</Text>
                            </HStack>

                            <Box>
                                <Heading className="text-lg font-bold" mb={2}>
                                    Description
                                </Heading>
                                <Text className="text-sm">{description}</Text>
                                <Button mt={2} colorScheme="blue" onClick={handleToggle}>
                                    {isExpanded ? "Show Less" : "Show More"}
                                </Button>
                            </Box>


                            <Box>
                                <VStack align="start" spacing={2}>
                                    <Text>
                                        <strong>Developer:</strong> {game.developers[0].name}
                                    </Text>
                                    <Text>
                                        <strong>Publisher:</strong> {game.publishers[0].name}
                                    </Text>
                                </VStack>
                            </Box>

                            <Divider />

                            <HStack spacing={4}>
                                <FaSteam size={32} />
                                <Text>Available on Steam</Text>
                            </HStack>
                        </VStack>

                    </Flex>

                </Box >
                {screenshots &&
                    <Screenshots screenshots={screenshots || []} />
                }
            </>
        ) : (<h1> loading... </h1>)}
    </>
    );
};

export default GameDetail;