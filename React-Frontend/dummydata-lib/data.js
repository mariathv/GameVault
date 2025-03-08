// Mock data for genres and games
export const genres = ["Action", "Adventure", "RPG", "Strategy", "Sports", "Racing", "Simulation", "Indie"]

export const games = [
    {
        id: 1,
        title: "Cyber Adventures 2077",
        description: "An epic open-world adventure in a dystopian future",
        longDescription:
            "Cyber Adventures 2077 is an open-world, action-adventure RPG set in a dystopian future where mega-corporations control every aspect of life. Play as a mercenary outlaw equipped with cybernetic enhancements as you navigate the sprawling metropolis of Night City. Make choices that impact the story and your character's development, engage in intense combat using a variety of high-tech weapons, and uncover the secrets of a city obsessed with power and body modification.",
        price: 59.99,
        rating: 4.5,
        genre: "Action",
        releaseDate: "2023-11-15",
        developer: "CD Project Red",
        publisher: "CD Project",
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        tags: ["Open World", "RPG", "Cyberpunk", "First-Person", "Futuristic"],
        features: ["Single-player", "Ray Tracing", "4K Support", "Controller Support"],
        systemRequirements: {
            minimum: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-4670K or AMD Ryzen 3 3200G",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 970 or AMD Radeon RX 570",
                storage: "70 GB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i7-8700K or AMD Ryzen 5 3600X",
                memory: "16 GB RAM",
                graphics: "NVIDIA GeForce RTX 3060 or AMD Radeon RX 6700 XT",
                storage: "70 GB SSD available space",
            },
        },
        image: "https://timelinecovers.pro/facebook-cover/download/video-game-cyberpunk-2077-facebook-cover.jpg",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: false,
        discount: 0,
    },
    {
        id: 2,
        title: "Medieval Kingdom",
        description: "Build your empire in this strategic medieval simulation",
        longDescription:
            "Medieval Kingdom is a grand strategy game that puts you in the role of a medieval ruler. Start with a small holding and expand your territory through diplomacy, warfare, and strategic marriages. Manage your economy, build castles and cities, raise armies, and navigate the complex politics of the medieval world. Will you rule as a benevolent king, or will you be remembered as a tyrant? The fate of your dynasty and kingdom is in your hands.",
        price: 49.99,
        rating: 4.8,
        genre: "Strategy",
        releaseDate: "2023-08-22",
        developer: "Paradox Interactive",
        publisher: "Paradox Interactive",
        platforms: ["PC", "Mac"],
        tags: ["Strategy", "Medieval", "Historical", "Simulation", "Grand Strategy"],
        features: ["Single-player", "Multiplayer", "Steam Achievements", "Steam Workshop"],
        systemRequirements: {
            minimum: {
                os: "Windows 7 (64-bit)",
                processor: "Intel Core i3-2100 or AMD Phenom II X4 965",
                memory: "4 GB RAM",
                graphics: "NVIDIA GeForce GTX 460 or AMD Radeon HD 6850",
                storage: "15 GB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-4670K or AMD Ryzen 5 2400G",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 1060 or AMD Radeon RX 580",
                storage: "15 GB available space",
            },
        },
        image: "/placeholder.svg?height=300&width=400",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: true,
        discount: 25,
    },
    {
        id: 3,
        title: "Space Explorer",
        description: "Explore the vast universe in this sci-fi adventure",
        longDescription:
            "Space Explorer is an epic sci-fi adventure game that takes you on a journey through the cosmos. As the captain of a customizable starship, you'll explore uncharted star systems, make first contact with alien civilizations, and uncover the mysteries of ancient precursor races. Navigate through complex diplomatic relations, engage in strategic space combat, and make decisions that will shape the future of the galaxy. With a procedurally generated universe, no two playthroughs are ever the same.",
        price: 39.99,
        rating: 4.2,
        genre: "Adventure",
        releaseDate: "2023-05-10",
        developer: "Bioware",
        publisher: "Electronic Arts",
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        tags: ["Space", "Sci-Fi", "Exploration", "Story Rich", "Open World"],
        features: ["Single-player", "Controller Support", "Cloud Saves"],
        systemRequirements: {
            minimum: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-3570K or AMD FX-8350",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 780 or AMD Radeon R9 290",
                storage: "50 GB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i7-7700K or AMD Ryzen 7 2700X",
                memory: "16 GB RAM",
                graphics: "NVIDIA GeForce RTX 2070 or AMD Radeon RX 5700 XT",
                storage: "50 GB SSD available space",
            },
        },
        image: "/placeholder.svg?height=300&width=400",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: false,
        discount: 0,
    },
    {
        id: 4,
        title: "Racing Champions",
        description: "Experience high-speed racing action",
        longDescription:
            "Racing Champions is the ultimate racing simulation that brings the thrill of high-speed competition to your fingertips. Choose from over 100 meticulously detailed vehicles from the world's top manufacturers and race on 45 accurately recreated tracks from around the globe. Experience realistic physics, dynamic weather conditions, and a day-night cycle that affects track conditions. Compete in various racing disciplines including circuit racing, rallycross, and endurance events. Climb the ranks from amateur to professional in the comprehensive career mode or challenge friends in multiplayer races.",
        price: 44.99,
        rating: 4.6,
        genre: "Racing",
        releaseDate: "2023-03-17",
        developer: "Codemasters",
        publisher: "Electronic Arts",
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S", "PlayStation 4", "Xbox One"],
        tags: ["Racing", "Simulation", "Multiplayer", "Realistic", "Sports"],
        features: ["Single-player", "Multiplayer", "Online Leaderboards", "Controller Support", "VR Support"],
        systemRequirements: {
            minimum: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i3-6100 or AMD FX-4350",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 950 or AMD Radeon R9 280",
                storage: "80 GB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-8600K or AMD Ryzen 5 3600X",
                memory: "16 GB RAM",
                graphics: "NVIDIA GeForce GTX 1660 Ti or AMD Radeon RX 5600 XT",
                storage: "80 GB SSD available space",
            },
        },
        image: "/placeholder.svg?height=300&width=400",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: true,
        discount: 15,
    },
    {
        id: 5,
        title: "Fantasy Quest",
        description: "Embark on an epic journey in a magical realm",
        longDescription:
            "Fantasy Quest is an immersive RPG set in a vast, open fantasy world teeming with magic, danger, and adventure. Create your character from multiple races and classes, each with unique abilities and storylines. Explore ancient ruins, dense forests, sprawling cities, and treacherous mountains as you uncover a tale of ancient prophecies and looming darkness. Make meaningful choices that shape the world around you, forge alliances with diverse factions, and face fearsome creatures in tactical combat. With hundreds of quests, a deep crafting system, and rich character progression, your journey through the realm of Eldoria will be uniquely yours.",
        price: 54.99,
        rating: 4.7,
        genre: "RPG",
        releaseDate: "2023-09-05",
        developer: "BioWare",
        publisher: "Electronic Arts",
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S"],
        tags: ["Fantasy", "Open World", "RPG", "Story Rich", "Magic"],
        features: ["Single-player", "Controller Support", "Cloud Saves", "Achievements"],
        systemRequirements: {
            minimum: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-6600K or AMD Ryzen 3 1300X",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 970 or AMD Radeon R9 390",
                storage: "100 GB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i7-8700K or AMD Ryzen 5 3600X",
                memory: "16 GB RAM",
                graphics: "NVIDIA GeForce RTX 2070 or AMD Radeon RX 5700 XT",
                storage: "100 GB SSD available space",
            },
        },
        image: "/placeholder.svg?height=300&width=400",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: false,
        discount: 0,
    },
    {
        id: 6,
        title: "City Builder Pro",
        description: "Create and manage your own metropolis",
        longDescription:
            "City Builder Pro is the definitive city-building simulation that puts you in the role of mayor and urban planner. Start with a patch of land and transform it into a bustling metropolis with skyscrapers, residential neighborhoods, industrial zones, and commercial districts. Manage your city's economy, infrastructure, and public services while responding to natural disasters, economic crises, and the changing needs of your citizens. Implement policies that affect everything from traffic patterns to pollution levels, and watch as your decisions shape the development and culture of your city. With detailed simulation systems modeling everything from individual citizens to city-wide traffic networks, City Builder Pro offers unparalleled depth and realism.",
        price: 34.99,
        rating: 4.4,
        genre: "Simulation",
        releaseDate: "2023-02-28",
        developer: "Colossal Order",
        publisher: "Paradox Interactive",
        platforms: ["PC", "Mac", "PlayStation 5", "Xbox Series X/S"],
        tags: ["City Builder", "Management", "Simulation", "Strategy", "Sandbox"],
        features: ["Single-player", "Steam Workshop", "Mod Support", "Cloud Saves"],
        systemRequirements: {
            minimum: {
                os: "Windows 7 (64-bit)",
                processor: "Intel Core i3-3210 or AMD FX-4350",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 660 or AMD Radeon HD 7870",
                storage: "25 GB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-6600K or AMD Ryzen 5 2600X",
                memory: "16 GB RAM",
                graphics: "NVIDIA GeForce GTX 1070 or AMD Radeon RX 5600 XT",
                storage: "25 GB SSD available space",
            },
        },
        image: "/placeholder.svg?height=300&width=400",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: true,
        discount: 30,
    },
    {
        id: 7,
        title: "Zombie Survival",
        description: "Fight for your life in a post-apocalyptic world",
        longDescription:
            "Zombie Survival is an intense survival horror game set in a world devastated by a zombie apocalypse. As one of the few remaining survivors, you must scavenge for resources, craft weapons and tools, build and fortify shelters, and fend off the relentless hordes of the undead. Explore a vast open world with diverse environments, from abandoned cities to rural countryside, each with unique challenges and resources. Team up with other survivors with distinct personalities and skills, but be wary of hostile human factions competing for limited supplies. With dynamic day-night cycles, weather systems, and zombie behavior patterns, every decision you make could mean the difference between survival and becoming one of the walking dead.",
        price: 39.99,
        rating: 4.3,
        genre: "Action",
        releaseDate: "2023-10-31",
        developer: "Capcom",
        publisher: "Capcom",
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S", "PlayStation 4", "Xbox One"],
        tags: ["Survival", "Horror", "Zombies", "Post-apocalyptic", "Crafting"],
        features: ["Single-player", "Co-op", "Multiplayer", "Controller Support"],
        systemRequirements: {
            minimum: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-4460 or AMD Ryzen 3 1200",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 760 or AMD Radeon R7 260x",
                storage: "40 GB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i7-6700K or AMD Ryzen 5 1600X",
                memory: "16 GB RAM",
                graphics: "NVIDIA GeForce GTX 1060 or AMD Radeon RX 580",
                storage: "40 GB SSD available space",
            },
        },
        image: "/placeholder.svg?height=300&width=400",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: false,
        discount: 0,
    },
    {
        id: 8,
        title: "Pixel Dungeon",
        description: "Classic roguelike adventure with pixel art graphics",
        longDescription:
            "Pixel Dungeon is a challenging roguelike game with charming pixel art aesthetics. Descend into a procedurally generated dungeon filled with monsters, traps, and treasures. Choose from multiple character classes, each with unique abilities and playstyles. Collect and identify magical items, brew potions, read scrolls, and equip powerful gear as you battle your way through increasingly difficult levels. Permadeath ensures that every run is tense and meaningful, while the game's deep systems and secrets provide endless replayability. Can you retrieve the legendary Amulet of Yendor from the depths of the dungeon?",
        price: 19.99,
        rating: 4.5,
        genre: "Indie",
        releaseDate: "2023-04-15",
        developer: "Watabou Games",
        publisher: "Indie Games Collective",
        platforms: ["PC", "Mac", "Linux", "Android", "iOS"],
        tags: ["Roguelike", "Pixel Graphics", "Dungeon Crawler", "Turn-Based", "Permadeath"],
        features: ["Single-player", "Achievements", "Leaderboards"],
        systemRequirements: {
            minimum: {
                os: "Windows 7",
                processor: "Intel Core i3-2100 or AMD equivalent",
                memory: "4 GB RAM",
                graphics: "Intel HD Graphics 4000",
                storage: "500 MB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-3470 or AMD equivalent",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 650 or AMD Radeon HD 7750",
                storage: "500 MB available space",
            },
        },
        image: "/placeholder.svg?height=300&width=400",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: true,
        discount: 50,
    },
    {
        id: 9,
        title: "Football Manager 2024",
        description: "The most realistic football management simulation",
        longDescription:
            "Football Manager 2024 is the most comprehensive and realistic football management simulation ever created. Take control of your favorite club from any of over 50 countries across the world, from the top flight to the lowest divisions. Develop young talent through your academy, scout for hidden gems in the transfer market, and implement your tactical vision on the pitch. Deal with player personalities, media pressure, board expectations, and financial constraints as you strive for glory. With an unparalleled database of real players and staff, meticulously researched by a global network of scouts, and sophisticated match engine that brings your tactical decisions to life, Football Manager 2024 is the closest thing to being a real football manager.",
        price: 49.99,
        rating: 4.8,
        genre: "Sports",
        releaseDate: "2023-11-07",
        developer: "Sports Interactive",
        publisher: "SEGA",
        platforms: ["PC", "Mac", "Nintendo Switch", "PlayStation 5", "Xbox Series X/S"],
        tags: ["Sports", "Management", "Simulation", "Football", "Soccer"],
        features: ["Single-player", "Steam Workshop", "Cloud Saves", "Controller Support"],
        systemRequirements: {
            minimum: {
                os: "Windows 7 (64-bit)",
                processor: "Intel Core i3-2100 or AMD FX-4300",
                memory: "8 GB RAM",
                graphics: "Intel HD Graphics 4000 or AMD Radeon R5 230",
                storage: "7 GB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-7500 or AMD Ryzen 5 1600",
                memory: "16 GB RAM",
                graphics: "NVIDIA GeForce GTX 1050 or AMD Radeon RX 560",
                storage: "7 GB SSD available space",
            },
        },
        image: "/placeholder.svg?height=300&width=400",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: false,
        discount: 0,
    },
    {
        id: 10,
        title: "Ocean Explorer",
        description: "Discover the mysteries of the deep sea",
        longDescription:
            "Ocean Explorer is a captivating underwater adventure game that lets you explore the mysterious depths of the world's oceans. Pilot a customizable submarine through diverse marine environments, from colorful coral reefs to the darkest abyssal trenches. Document and interact with hundreds of species of marine life, each with realistic behaviors and ecological roles. Uncover the secrets of ancient underwater civilizations, investigate environmental threats to ocean ecosystems, and collect specimens for your research base. With stunning visuals, an atmospheric soundtrack, and educational content based on real marine biology and oceanography, Ocean Explorer offers both entertainment and enlightenment about our planet's final frontier.",
        price: 29.99,
        rating: 4.4,
        genre: "Adventure",
        releaseDate: "2023-07-20",
        developer: "Deep Blue Studios",
        publisher: "Ocean Games",
        platforms: ["PC", "PlayStation 5", "Xbox Series X/S", "Nintendo Switch"],
        tags: ["Underwater", "Exploration", "Educational", "Relaxing", "Nature"],
        features: ["Single-player", "Photo Mode", "Encyclopedia", "Controller Support"],
        systemRequirements: {
            minimum: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i3-6100 or AMD Ryzen 3 1200",
                memory: "8 GB RAM",
                graphics: "NVIDIA GeForce GTX 750 Ti or AMD Radeon R7 370",
                storage: "20 GB available space",
            },
            recommended: {
                os: "Windows 10 (64-bit)",
                processor: "Intel Core i5-8400 or AMD Ryzen 5 2600",
                memory: "16 GB RAM",
                graphics: "NVIDIA GeForce GTX 1060 or AMD Radeon RX 580",
                storage: "20 GB SSD available space",
            },
        },
        image: "/placeholder.svg?height=300&width=400",
        screenshots: [
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
            "/placeholder.svg?height=600&width=800",
        ],
        onSale: true,
        discount: 20,
    },
]

// Mock user data
export const users = [
    {
        id: 1,
        username: "gamer123",
        email: "gamer123@example.com",
        avatar: "/placeholder.svg?height=100&width=100",
        purchaseHistory: [
            { id: 1, gameId: 1, date: "2023-12-15", price: 59.99 },
            { id: 2, gameId: 5, date: "2023-11-20", price: 54.99 },
            { id: 3, gameId: 3, date: "2023-10-05", price: 39.99 },
        ],
        wishlist: [2, 4, 6],
    },
]

export const CartItem = {
    gameId: null,
    quantity: 0
}

export const CartState = {
    items: null,
    subtotal: null,
    tax: null,
    total: null
}

// Mock cart data
export const initialCart = {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
}

// Helper functions
export const calculateCartTotals = (items) => {
    const subtotal = items.reduce((total, item) => {
        const game = games.find((g) => g.id === item.gameId)
        if (!game) return total

        const price = game.onSale ? game.price * (1 - game.discount / 100) : game.price

        return total + price * item.quantity
    }, 0)

    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + tax

    return {
        subtotal: Number.parseFloat(subtotal.toFixed(2)),
        tax: Number.parseFloat(tax.toFixed(2)),
        total: Number.parseFloat(total.toFixed(2)),
    }
}

