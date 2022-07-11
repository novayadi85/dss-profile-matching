import { QUERY_ALL_MODULES_WORKFLO } from '@gql/workflow_modules'
import Table from '@components/Table'
import { useNavigate } from 'react-router-dom'

const usingByFormater = (cell) => `${cell.getValue()} Roles`

const columns = [
    //{title:"id", field:"id", width: 100},
    { title: "Name", field: "name" },
    { title: "Using By", field: "workflowsByModuleId.totalCount", formatter: usingByFormater, headerSort: false },
]

const ModuleList = (prop) => {
    const navigate = useNavigate()

    const tableAction = (cell) => {
        console.log(cell)
        const { action, row } = cell
        switch (action) {
            case 'edit':
                navigate(`/workflow/${row._nodeId}`)
                break
            default:
                break
        }
    }

    return (
        <>
            <h2 className="intro-y text-lg font-medium mt-10">Workflow</h2>
      
            <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
            <Table query={QUERY_ALL_MODULES_WORKFLO} columns={columns} option={
                {
                    //paginationSize: 2,
                    //paginationSizeSelector: [2, 100, 200, 300, 400, 500],
                }
            }
                action={[true, 'View']}
                callback={tableAction}
            
            />
        </div>
        </>
    )
}

export default ModuleList