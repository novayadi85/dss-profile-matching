const SearchDownPayment = (prop) => {
    return(
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Serch PO Trade</h2>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-6">
                    <div className="intro-y box p-5">
                        <div>
                            <label htmlFor="crud-form-1" className="form-label">PO Trade Number <span className="text-theme-6">*</span></label>
                            <input
                                id="crud-form-1"
                                type="text"
                                className="form-control w-full"
                                placeholder="PO Trade Number "
                            />
                        </div>
                        <div className="text-right mt-5">
                            <button type="button" className="btn btn-primary w-24">Search</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SearchDownPayment;