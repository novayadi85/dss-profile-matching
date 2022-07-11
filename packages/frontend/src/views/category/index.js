import { Routes, Route } from 'react-router-dom'
import PrivateLayout from '@components/layout/privateLayout'
import ListCategory from './list';
import ManageCat from './manage';

const Role = () => {
  return (
    <PrivateLayout>
      <Routes>
        <Route path="/" element={<ListCategory />} />
        <Route path="/:id" element={<ManageCat />} />
      </Routes>
    </PrivateLayout>
  )
}

export default Role