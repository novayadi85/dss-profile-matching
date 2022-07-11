import { ModalDelete } from "@components/overlay/modal"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Table from "@components/Table"
import { QUERY_ALL_GAPS} from "@gql/gaps"
import { QUERY_ALL_CATEGORY } from "../../apollo/category"

const columns = [
  { title: "#ID", field: "id", width: 100 },
  { title: "Title", field: "title" },
  { title: "Percentage", field: "percentage" }
]
const searchFieldName = ["title"]

const ListCategory = (prop) => {

  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const navigate = useNavigate()

  const tableAction = (cell) => {
    console.log(cell)
    const { action, row } = cell

    switch (action) {
      case "delete":
        /* setSelectedId(row._nodeId)
        setOpen(true) */
        alert('not access to delete')
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
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          Category data
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