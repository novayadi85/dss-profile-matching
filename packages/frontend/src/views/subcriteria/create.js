import { useEffect, useState } from "react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import { useMutation, useQuery } from '@apollo/client'
import { ADD_SUB_CRITERIA, UPDATE_SUB_CRITERIA } from '@gql/sub_criteria';
import { GET_CRITERIA } from "@gql/criteria";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AddCondition = (props) => {
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [parentid, setParentId] = useState(false)
  
  const [isUpdating, setIsUpdating] = useState("")
  const { token, user } = useSelector(state => state.auth)

  const navigate = useNavigate()
  const { id } = useParams()

  const { loading, error, data } = useQuery(GET_CRITERIA, {
		variables: {
		  nodeId: id,
		},
		onCompleted: (data) => {
		  const criterion = data.criterion;
		  setParentId(criterion.id);
		}
	})

  const [addSubCondition, { loading: addLoading }] = useMutation(ADD_SUB_CRITERIA, {
    onCompleted: (data) => {
      navigate(`/criteria/${id}`, { replace: true });
    }
  });

  const [updateSubCondition, { loading: updateLoading }] = useMutation(UPDATE_SUB_CRITERIA, {
    onCompleted: (data) => {
      navigate(`/criteria/${id}`, { replace: true });
    }
  });

  const handleSubmit = () => {

    let variables = {
      name: name,
      value: Number(value),
      parentId: parentid
    }
    if (isUpdating) {
      variables.nodeId = id
      updateSubCondition({ variables })
    } else {
      addSubCondition({ variables })
    }
  }

  return (
    <>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Add Sub Criteria</h2>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 lg:col-span-12">
          <div className="intro-y box p-5">
            <div className="mt-2 w-2/4">
              <label htmlFor="crud-form-1" className="form-label">Sub Criteria <span className="text-theme-6">*</span></label>
              <input
                id="crud-form-1"
                type="text"
                className="form-control w-full"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-3 w-2/4">
              <label>Ideal Value</label>
              <div className="mt-2">
                <input
                  id="crud-form-1"
                  type="number"
                  className="form-control w-full"
                  placeholder="Value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>
            <div className="text-right mt-5">
              <Link to={'/criteria/' + id} className="btn btn-outline-secondary w-24 mr-1">Cancel</Link>
              <button
                type="button"
                className="btn btn-primary w-24"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddCondition;