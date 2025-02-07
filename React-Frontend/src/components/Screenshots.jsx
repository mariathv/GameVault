import { Box, Image, Heading } from "@chakra-ui/react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const Screenshots = ({ screenshots }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    }

    return (
        <Box bg="gray.900" color="white" p={8} borderRadius="md" mt={8}>
            <Heading as="h2" size="lg" mb={6} textAlign="center">
                Game Screenshots
            </Heading>

            <Slider {...settings}>
                {screenshots.map((screenshot, index) => (
                    <Box key={index} px={2}>
                        <Image
                            src={screenshot || "/placeholder.svg"}
                            alt={`Screenshot ${index + 1}`}
                            borderRadius="lg"
                            boxShadow="md"
                            objectFit="cover"
                            w="100%"
                            h="200px"
                            _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }}
                        />
                    </Box>
                ))}
            </Slider>
        </Box>
    )
}

export default Screenshots

