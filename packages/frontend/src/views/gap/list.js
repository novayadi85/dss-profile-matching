import { ModalDelete } from "@components/overlay/modal"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Table from "@components/Table"
import { QUERY_ALL_GAPS} from "@gql/gaps"

const usingByFormater = (cell) => `${cell.getValue()} Users`

const columns = [
  { title: "Gap", field: "gap", width: 100 },
  { title: "Integrity", field: "integrity", width: 100 },
  { title: "Note", field: "note" }
]
const searchFieldName = ["name"]

const ListRole = (prop) => {

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
        navigate(`/gap/${row._nodeId}`)
        break;

      default:
        break;
    }
  }

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          GAP data
        </h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
          <Link to={'/gap/create'} className="btn btn-primary shadow-md mr-2">Add New</Link>
        </div>
      </div>
      
      <Table query={QUERY_ALL_GAPS} columns={columns} option={
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
export default ListRole;