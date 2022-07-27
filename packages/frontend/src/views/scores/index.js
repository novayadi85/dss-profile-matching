import React, { useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import cash from "cash-dom";
import PrivateLayout from '@components/layout/privateLayout';
import Table from '@components/Table';
import ManageUser from './manage';
import { QUERY_ALL_PLAYER, DELETE_PLAYER } from '@gql/player';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';


const usingByFormater = (cell) => `<button class="btn btn-rounded btn-dark me-1 ">${cell.getValue()}</button>`

const columns = [
  { title: "Number", field: "backNumber", width: 100 , formatter: usingByFormater },
  { title: "Name", field: "name" },
  { title: "Birth", field: "birth" },
  { title: "Position", field: "position" },
  { title: "Phone", field: "phone" },
]
const searchFieldName = ["name", "backNumber"]

const DefaultPage = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')

  const [deleteData, { data, loading, error }] = useMutation(DELETE_PLAYER, {
    onCompleted: (data) => {
      setOpen(false)
    }
  });
  
  const handleDelete = () => {
    deleteData({
      variables: {
        nodeId: selectedId
      }
    })
  }

  const tableAction = (cell) => {
    console.log(cell)
    const { action, row } = cell

    switch (action) {
      case "delete":
        setSelectedId(row._nodeId)
        setOpen(true) 
        break;

      case "edit":
        navigate(`/scores/${row._nodeId}`)
        break;

      default:
        break;
    }
  }

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          {t('Players')} 
        </h2>
      </div>
      {/* <DeleteUser /> */}
      <Table query={QUERY_ALL_PLAYER}
        columns={columns}
        // option={{
        //   paginationSize: 2,
        //   paginationSizeSelector: [2, 100, 200, 300, 400, 500],
        // }}
        action={[true, "View"]}
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