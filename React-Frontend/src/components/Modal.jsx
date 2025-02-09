import { useState, useEffect, useCallback } from "react";
import { AspectRatio, Image } from "@chakra-ui/react";
const Modal = ({ isOpen, onClose, gameInfo, cover }) => {
    const [isModalOpen, setIsModalOpen] = useState(isOpen);

    useEffect(() => {
        setIsModalOpen(isOpen);
    }, [isOpen]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        onClose();
    }, [onClose]);

    const handleEscape = useCallback(
        (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        },
        [closeModal]
    );

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isModalOpen, handleEscape]);

    if (!isModalOpen) return null;


    function convertImageUrl(url, newSize = "t_1080p") {
        return url.replace(/t_[^/]+/, newSize);
    }

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-opacity-10 items-center flex justify-center">
            <div
                className="fixed inset-0 backdrop-blur-custom transition-opacity"
                onClick={closeModal}
            ></div>
            <div className="flex flex-row justify-center items-center w-full h-full ">

                <div className="relative bg-[#141B26] pl-5 pr-5 w-full max-w-3xl m-4 rounded-lg shadow-lg flex flex-row pt-3 pb-3  ">
                    {/* Image Section */}
                    <div className="justify-center items-center min-w-60 self-center">
                        <AspectRatio ratio={3 / 4} >
                            <Image
                                src={convertImageUrl(cover)}
                                borderRadius="10"
                                alt={gameInfo.name}
                            />
                        </AspectRatio>
                    </div>


                    {/* Content Section */}
                    <div className="px-6 py-4  flex-grow">
                        <h2 id="modal-title" className="text-xl font-semibold mb-2 text-[#EDEDED]">
                            {gameInfo.name}
                        </h2>
                        <p className="text-[#EDEDED] text-sm">{gameInfo.summary}</p>

                        <div className="flex flex-row gap-2">
                            <div className="w-full max-w-[200px] min-w-[10px] mt-5">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        placeholder="Price"
                                    />

                                    <i className="fas fa-dollar absolute w-5 h-5 top-2.5 right-2.5 text-slate-600"></i>
                                </div>
                            </div>
                            <div className="w-full max-w-[150px] min-w-[10px] mt-5">
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full pl-3 pr-10 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        placeholder="Copies"
                                    />

                                    <i className="fas fa-paper absolute w-5 h-5 top-2.5 right-2.5 text-slate-600"></i>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                            >
                                Confirm
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
};

export default Modal;