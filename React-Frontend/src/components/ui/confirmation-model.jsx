import React from 'react';

function ConfirmationModel({ onConfirm, onCancel, modalText }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 confirm-dialog">
            <div className="relative px-4  flex items-center justify-center">
                <div className="opacity-25 w-full h-full absolute z-10 bg-gray-800"></div>
                <div className="bg-white rounded-lg p-4 shadow-lg relative z-50">
                    <div className="flex items-center">
                        <div className="rounded-full border-5 border-green-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                            <span className="text-3xl text-green-500">&#10004;</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-700 mt-1">
                                {modalText}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">

                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-(--color-accent-primary)/80 rounded-lg font-semibold text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModel;
