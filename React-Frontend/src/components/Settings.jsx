function Settings() {
    return (
        <div className="mt-8">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2">
                <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                            htmlFor="store-name"
                        >
                            Store Name
                        </label>
                        <input
                            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                            id="store-name"
                            type="text"
                            placeholder="My Game Store"
                        />
                    </div>
                    <div className="md:w-1/2 px-3">
                        <label
                            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                            htmlFor="contact-email"
                        >
                            Contact Email
                        </label>
                        <input
                            className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                            id="contact-email"
                            type="email"
                            placeholder="admin@example.com"
                        />
                    </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-full px-3">
                        <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="currency">
                            Currency
                        </label>
                        <select
                            className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
                            id="currency"
                        >
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings

