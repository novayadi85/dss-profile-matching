import PrivateLayout from '@components/layout/privateLayout';
import { Routes, Route } from 'react-router-dom';
import AddCondition from './create';
import EditCondition from './update';

const Department = () =>
  <PrivateLayout>
    <Routes>
      <Route path="add/:id" element={<AddCondition/>}/>
      <Route path="edit/:id" element={<EditCondition/>}/>
    </Routes>
  </PrivateLayout>
export default Department