import { Routes, Route} from 'react-router-dom'
import PrivateLayout from '@components/layout/privateLayout'
import SearchDownPayment from './search'
import ManageDownPayment from './manage'

const RequestDp = () => {
    return (
        <PrivateLayout>
            <Routes>
                <Route path="/" element={<SearchDownPayment />} />
                <Route path="/:id" element={<ManageDownPayment />} />
            </Routes>
        </PrivateLayout>
    )
}

export default RequestDp