import { ModalDelete } from "@components/overlay/modal"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Table from "@components/Table"
import { QUERY_ALL_GAPS, DELETE_GAP} from "@gql/gaps"
import { useMutation } from "@apollo/client"
import { useTranslation } from "react-i18next"

let number = 1;
const autoNumber = () => {
  return number++;
}


const columns = [
  { title: "ID", field: "ID", width: 100 , mutator:autoNumber},
  { title: "Gap", field: "gap", width: 100 },
  { title: "Integrity", field: "integrity", width: 100 },
  { title: "Note", field: "note" }
]
const searchFieldName = ["name"]

const ListGap = (prop) => {
	const { t } = useTranslation();
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const navigate = useNavigate()

  const [deleteData, { data, loading, error }] = useMutation(DELETE_GAP, {
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
        navigate(`/gap/${row._nodeId}`)
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
          {t('GAP data')}
        </h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
          <Link to={'/gap/create'} className="btn btn-primary shadow-md mr-2">{t('Add New')}</Link>
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
export default ListGap;