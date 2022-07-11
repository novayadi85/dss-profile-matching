import { Routes, Route } from 'react-router-dom'
import PrivateLayout from '@components/layout/privateLayout'
import ListGap from './list';
import ManageGap from './manage';

const Role = () => {
  return (
    <PrivateLayout>
      <Routes>
        <Route path="/" element={<ListGap />} />
        <Route path="/:id" element={<ManageGap />} />
      </Routes>
    </PrivateLayout>
  )
}

export default Role