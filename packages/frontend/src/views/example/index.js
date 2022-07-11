import { useQuery } from '@apollo/client'
import { Routes, Route } from 'react-router-dom';

import Child1 from "./child1"

import { REGISTER_FLOW } from '@gql/workflow_modules'
const Example = () => {
    const { loading, data, error } = useQuery(REGISTER_FLOW)
    return <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 2xl:col-span-9">
            <h1>Example Page</h1>
            <p className="font-medium ">The quick brown fox ...</p>
            <div className="border border-indigo-600 ">
                <p>child component</p>
                <Routes>
                    <Route path=":id" element={<Child1 />} />
                </Routes>
            </div>
        </div>
    </div>
}

export default Example