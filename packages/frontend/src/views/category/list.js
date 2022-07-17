import { ModalDelete } from "@components/overlay/modal"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Table from "@components/Table"
import { useMutation } from '@apollo/client';
import { QUERY_ALL_CATEGORY, DELETE_CATEGORY } from "../../apollo/category"

let number = 1;
const autoNumber = () => {
  return number++;
}

const columns = [
  { title: "ID", field: "ID", width: 100 , mutator:autoNumber},
  { title: "Title", field: "title" },
  { title: "Percentage", field: "percentage" }
]
const searchFieldName = ["title"]

const ListCategory = (prop) => {

  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const navigate = useNavigate()

  const [deleteCategory, { data, loading, error }] = useMutation(DELETE_CATEGORY, {
    onCompleted: (data) => {
      setOpen(false)
    }
  });
  
  const handleDelete = () => {
    deleteCategory({
      variables: {
        nodeId: selectedId
      }
    })
  }

  const tableAction = (cell) => {

    const { action, row } = cell

    switch (action) {
      case "delete":
        setSelectedId(row._nodeId)
        setOpen(true) 
        break;

      case "edit":
        navigate(`/category/${row._nodeId}`)
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
          Criteria data
        </h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
          <Link to={'/category/create'} className="btn btn-primary shadow-md mr-2">Add New</Link>
        </div>
      </div>
      
      <Table query={QUERY_ALL_CATEGORY} columns={columns} option={
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
  );
}
export default ListCategory;