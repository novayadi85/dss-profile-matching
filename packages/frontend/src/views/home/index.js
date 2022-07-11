import React, { useEffect } from 'react';
import PrivateLayout from '@components/layout/privateLayout';
import { Overview  } from '../../components/table/overview';

const Dashboard = () => {
    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        setup();
    });

    const setup = () => {

    }

    return (<PrivateLayout>
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 2xl:col-span-12">
                <div className="col-span-12 2xl:col-span-3">
                    <div className="2xl border-theme-5 -mb-10 pb-10">
                        <div className="2xl:pl-6 grid grid-cols-12 gap-6">
                            {/** BEGIN: Transactions */}
                            <div className="col-span-12 md:col-span-12 xl:col-span-12 2xl:col-span-12 mt-3">
                                <div className="intro-x flex items-center h-10">
                                    <h1 className="text-lg font-bold mr-5">
                                        Rating player of the week
                                    </h1>
                                    <div className="form-check form-switch w-sm-auto ms-sm-auto mt-3 mt-sm-0 ps-0">
                                        <button className='btn btn-success w-24 me-1 mb-2'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-refresh-cw d-block mx-auto"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg></button>
                                    </div>
                                </div>
                                <div className="mt-5"><Overview/></div>
                            </div>
                            {/** END: Transactions */}

                        </div>
                    </div>
                </div>


            </div>
        </div>
    </PrivateLayout>
    );
}
export default Dashboard