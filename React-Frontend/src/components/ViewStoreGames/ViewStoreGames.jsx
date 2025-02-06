import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    Stack,
    Heading,
    Image,
    AspectRatio,
    Center,
} from "@chakra-ui/react";
import "../../styles/GameStoreAdmin.css"



const ViewGames = () => {

    const [games, setGames] = useState([]);

    if (!games || games.length === 0) {
        console.log("no game in stoer");
        return null;
    }

    function getStoreGames() {
        //later
    }

    useEffect(() => {
        //call the getStoreGames after its defined
    }, [])

    return (

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-5 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {games.slice(0, 7).map((game) => (

                    <Card
                        className="game-card"
                        maxW="sm"
                        transition="transform 0.3s"
                        _hover={{
                            transform: "scale(1.05)",
                        }}
                    >
                        <CardBody>
                            <AspectRatio maxW="260px" ratio={4 / 5}>
                                <Image
                                    src={game.image?.original_url || 'fallback_image_url.jpg'}
                                    borderTopRadius="10"
                                    alt={game.name}
                                />
                            </AspectRatio>
                            <Stack spacing="3">
                                <Heading
                                    className="chakra-heading-1"
                                    textAlign="center"
                                    verticalAlign="middle"
                                >
                                    {game.name}
                                </Heading>
                            </Stack>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>

    );
};

export default ViewGames;