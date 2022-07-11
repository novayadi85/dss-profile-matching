import PrivateLayout from '@components/layout/privateLayout';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Table from '@components/Table';
import { QUERY_ALL_CRITERIA, DELETE_CRITERIA } from '@gql/criteria';

import ManageCriteria from './manage';
import { useState } from 'react';
import { ModalDelete } from '../../components/overlay/modal';
import { useMutation } from '@apollo/client';

const columns = [
  //{ title: "id", field: "id", width: 100 },
  { title: "Name", field: "name" },
  { title: "Type", field: "type" },
  { title: "Position", field: "position" },
  { title: "Ideal Value", field: "idealValue" }
]

const searchFieldName = ["name"]

const DefaultPage = () => {

  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState("")
  const navigate = useNavigate()

  const tableAction = (cell) => {
    const { action, row } = cell
    switch (action) {
      case "delete":
        setSelectedId(row._nodeId)
        setOpen(true)
        break;

      case "edit":
        navigate(`/criteria/${row._nodeId}`)
        break;

      default:
        break;
    }
  }

  const [deleteCriterion, { data, loading, error }] = useMutation(DELETE_CRITERIA, {
    onCompleted: (data) => {
      setOpen(false)
    }
  });
  const handleDelete = () => {
    deleteCriterion({
      variables: {
        nodeId: selectedId
      }
    })
  }

  return <>
    <ModalDelete
      open={open}
      setOpen={setOpen}
      onConfirm={() => handleDelete()}
    />

    <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
      <h2 className="text-lg font-medium mr-auto">
        {'Criteria data'}
      </h2>
      <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
        <Link to={'/criteria/create'} className="btn btn-primary shadow-md mr-2">Add New</Link>
      </div>
    </div>

    <Table query={QUERY_ALL_CRITERIA} columns={columns} option={
        {
          //paginationSize: 2,
          //paginationSizeSelector: [2, 100, 200, 300, 400, 500],
        }
      }
        action={true}
        callback={tableAction}
        searchFieldName={searchFieldName}
      />
  </>
}
const Position = () =>
  <PrivateLayout>
    <Routes>
      <Route path=":id" element={<ManageCriteria />} />
      <Route path="/" element={<DefaultPage />} />
    </Routes>
  </PrivateLayout>
export default Position