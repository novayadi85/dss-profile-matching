import {Routes, Route} from "react-router-dom";
import PrivateLayout from "@components/layout/privateLayout";
import ModuleList from "./list"
import ManageFlow from "./manage";

const Workflow = () => {
    return (
        <PrivateLayout>
            <Routes>
                <Route path="/" element={<ModuleList />} />
                <Route path="/:id" element={<ManageFlow />} />
            </Routes>
        </PrivateLayout>
    );
}
export default Workflow;