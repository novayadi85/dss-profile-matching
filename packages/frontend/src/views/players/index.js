import React, { useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import cash from "cash-dom";
import PrivateLayout from '@components/layout/privateLayout';
import Table from '@components/Table';
import ManageUser from './manage';
import { QUERY_ALL_PLAYER, DELETE_PLAYER } from '@gql/player';
import { ModalDelete } from "@components/overlay/modal"
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
  let navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const { t } = useTranslation();
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
        navigate(`/players/${row._nodeId}`)
        break;

      default:
        break;
    }
  }

  return (
    <>
      <ModalDelete
        open={open}
        setOpen={setOpen}
        onConfirm={() => handleDelete()}
        />
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          {t('Player data')} 
        </h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
          <Link to={'/players/create'} className="btn btn-primary shadow-md mr-2">{t('Add New')}</Link>
        </div>
      </div>
      {/* <DeleteUser /> */}
      <Table query={QUERY_ALL_PLAYER}
        columns={columns}
        // option={{
        //   paginationSize: 2,
        //   paginationSizeSelector: [2, 100, 200, 300, 400, 500],
        // }}
        option={{
          orderBy: 'POSITION_ASC'
        }}
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