import React, { useState } from "react"
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import cash from "cash-dom";
import PrivateLayout from '@components/layout/privateLayout';
import Table from '@components/Table';
import ManageUser from './manage';
import { QUERY_ALL_USER_WITH_VARIABLE } from '@gql/users';
import { RestrictDelete } from '../../components/overlay/modal';

const columns = [
  { title: "id", field: "id", width: 100 },
  { title: "First name", field: "firstName" },
  { title: "Last name", field: "lastName" },
]
const searchFieldName = ["email"]

const DefaultPage = () => {
  let navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')

  const tableAction = (cell) => {

    const { action, row } = cell

    switch (action) {
      case "delete":
        setSelectedId(row._nodeId)
        setOpen(true) 
        break;

      case "edit":
        navigate(`/users/${row._nodeId}`)
        break;

      default:
        break;
    }
}

  return (
    <>
      <RestrictDelete open={open}
        setOpen={setOpen}
        onConfirm={() => setOpen(false)}
      />
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          {'User data'}
        </h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
          <Link to={'/users/create'} className="btn btn-primary shadow-md mr-2">Add New</Link>
        </div>
      </div>
      {/* <DeleteUser /> */}
      <Table query={QUERY_ALL_USER_WITH_VARIABLE}
        columns={columns}
        // option={{
        //   paginationSize: 2,
        //   paginationSizeSelector: [2, 100, 200, 300, 400, 500],
        // }}
        action={true}
        callback={tableAction}
        searchFieldName={searchFieldName}
      />
    </>
  )
}

const User = () => {

  return (
    <PrivateLayout>
      <Routes>
        <Route path=":id" element={<ManageUser />} />
        <Route path="/" element={<DefaultPage />} />
      </Routes>
    </PrivateLayout>
  )
}
export default User