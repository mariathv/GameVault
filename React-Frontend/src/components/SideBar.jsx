import { FaGamepad, FaPlus, FaList, FaShoppingCart, FaCog } from "react-icons/fa"

function Sidebar({ activeTab, setActiveTab }) {
    const navItems = [
        { id: "add-game", label: "Add Game", icon: FaPlus },
        { id: "view-games", label: "View Games", icon: FaList },
        { id: "purchases", label: "Purchases", icon: FaShoppingCart },
        { id: "settings", label: "Settings", icon: FaCog },
    ]

    return (
        <div className="flex flex-col w-64 bg-[#141B26]">
            <div className="flex items-center justify-center h-20 shadow-md flex-row">
                <img src="/src/assets/imgs/logo/1.png" className="w-10"></img>
                <div>
                    <h1 className="text-2xl uppercase text-white">
                        GameVault
                    </h1>
                    <label className="text-gray-500 text-sm">
                        Admin Dashboard
                    </label>
                </div>

            </div>

            <ul className="flex flex-col py-4">
                {navItems.map((item) => (
                    <li key={item.id}>
                        <a
                            href="#"
                            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${activeTab === item.id ? "text-gray-100" : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                                <item.icon />
                            </span>
                            <span className="text-sm font-medium">{item.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar