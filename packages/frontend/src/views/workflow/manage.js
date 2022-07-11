import Select from "react-select";
import { REGISTER_FLOW } from '@gql/workflow_modules'
import { useQuery } from "@apollo/client"
import {sortableContainer, sortableElement} from "react-sortable-hoc"
import { arrayMove } from "react-sortable-hoc";


const SortableItem = sortableElement(({value}) => <li>{value}</li>)

const SortableContainer = sortableContainer(({children}) => {
    return <ul>{children}</ul>;
});

const short = {
    items: ['Role 1 - approve, reject', 'Role 2 - approve, reject, cancel', 'Role 3 if equal 100', 'Role 1']
}

const ManageFlow = (prop) => {
    const { loading, error, data } = useQuery(REGISTER_FLOW);

    const roleList = data?.allTblRoles?.nodes ?? []

    const roleOptions = roleList.map((e) => {
        return { value: e.id, label: e.name.trim() }
    })

    return(
        <>
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Module Name - Set Workflow</h2>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 lg:col-span-6">
                    <div className="intro-y box">
                        <div className="flex flex-col sm:flex-row items-center p-5 border-b border-gray-200 dark:border-dark-5">
                            <h2 className="font-medium text-base mr-auto">Choose</h2>
                        </div>
                        <div id="basic-select" className="p-5">
                            <div className="preview">
                                <div>
                                    <label>Role <span className="text-theme-6">*</span></label>
                                    <Select
                                        placeholder="Choose One"
                                        isSearchable
                                        options={roleOptions}
                                    />
                                </div>
                                <div class="mt-3">
                                    <label>Condition </label>
                                    if po_net_value
                                    <Select 
                                        options={[
                                            {value: 1, label: 'Equal'},
                                            {value: 2, label: 'Greather'},
                                            {value: 3, label: 'Lower'}
                                        ]}
                                    />
                                    <input />
                                </div>

                                <div class="mt-3">
                                    <label>Action <span className="text-theme-6">*</span></label>
                                    <Select 
                                        isMulti
                                        options={[
                                            {value: 1, label: 'approve'},
                                            {value: 2, label: 'reject'},
                                            {value: 3, label: 'cancel'}
                                        ]}
                                    />
                                </div>

                                <button className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">
                                    Add
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="intro-y col-span-12 lg:col-span-6">
                    <div className="intro-y box">
                        <div className="flex flex-col sm:flex-row items-center p-5 border-b border-gray-200 dark:border-dark-5">
                            <h2 className="font-medium text-base mr-auto">Flow</h2>
                        </div>
                        <SortableContainer>
                            {short.items.map((value, index) => (
                                <SortableItem key={`item-${value}`} index={index} value={value} />
                            ))}
                        </SortableContainer>
                    </div>
                </div>

            </div>
        </>
    );
}
export default ManageFlow;