import cash from "cash-dom";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from "@apollo/client";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import { Plus, Trash } from 'react-feather'
import Select from 'react-select'
import TextInput from "@components/input/TextInput";
import DatePicker from "@components/input/DatePicker";
import TextArea from "@components/input/TextArea";
import { FileUploader } from "react-drag-drop-files";
import { ADD_GAP, UPDATE_GAP, GET_GAP } from "@gql/gaps";
import { GET_CRITERIA_AND_SUBS } from "@gql/sub_criteria";

const ManageGap = (props) => {
	const navigate = useNavigate()
  	const { id } = useParams()
	const [recordId, setRecordId] = useState(false)
	const [nodeId, setNodeId] = useState(false)
	const [criterion, setCriterion] = useState([])
	const isUpdating = id ? id != "create" : false
	const [formData, setFormData] = useState({
		gap: null,
        integrity: null,
        note: null,
        subCriteriaId: null,
	})

	useEffect(() => {
		cash(".editor").each(function () {
			const el = this;
			InlineEditor.create(el).catch((error) => {
				console.error(error);
			});
		});
    }, [])
    
    const get_subs = useQuery(GET_CRITERIA_AND_SUBS, {
        variables: {
            first: 500,
        },
		onCompleted: (data) => {
            const criterion = data.allCriteria;
            const options = [];

		    setCriterion(options);
		}
	})

	const { loading, error, data } = useQuery(GET_GAP, {
		skip: !isUpdating,
		variables: {
		  nodeId: id,
		},
		onCompleted: (data) => {
		  const gap = data.gap;
		  const formDatas = {
			gap: gap.gap,
			integrity: gap.integrity, 
			note: gap.note,
			subCriteriaId: gap.subCriteriaId,
		  }

		  setRecordId(gap.id);
		  setNodeId(gap._nodeId);
		  setFormData(formDatas)
		}
	})

	const [addPlayer, { loading: addLoading }] = useMutation(ADD_GAP, {
		onCompleted: (data) => {
		  navigate("/gap", { replace: true });
		}
	  });
	
	const [updatePlayer, { loading: updateLoading }] = useMutation(UPDATE_GAP, {
		onCompleted: (data) => {
		  navigate("/gap", { replace: true });
		}
	});


	const handleChange = (key, event) => {
		setFormData((prev) => ({ ...prev, [key]: event.target.value }))
	};

	const handleSelectChange = (key, event, isMulti = false) => {
		if (isMulti) {
			let array = []
			event.forEach(e => {
				array.push(e.value)
			})
			setFormData((prev) => ({ ...prev, [key]: array }))
		} else {
			setFormData((prev) => ({ ...prev, [key]: event.value }))
		}
	};

	const handleFileChange = (key, file) => {
		setFormData((prev) => ({
			...prev,
			file: {
				...prev.file,
				[key]: file
			}
		}));
	};

	// handle form
	const handleSubmit = (e) => {
		e.preventDefault()
		console.log(formData)
        let variables = formData
        variables.gap = parseFloat(variables.gap)
        variables.integrity = Number(variables.integrity)
		if (isUpdating) {
			variables.nodeId = id
			updatePlayer({ variables })
		} else {
			addPlayer({ variables })
		}
	}

	return (
		<>
			<div className="intro-y flex items-center mt-8">
				<h2 className="text-lg font-medium mr-auto">{isUpdating ? "Edit" : "Add"} Gap</h2>
			</div>
			<div className="intro-y box p-2 mt-5">
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="grid grid-cols-12">
						
						<div className="col-span-12 lg:col-span-12 px-3 pt-3 pb-0">
							<h4 className="font-bold mb-0"></h4>
						</div>
						<div className="col-span-6 lg:col-span-6 p-3" style={{display: 'none'}}>
							<div className="mt-2">
								<label htmlFor="crud-form-6" className="form-label">Criteria <span className="text-theme-6">*</span></label>
								<Select
									id="crud-form-6"
									placeholder={'Choose One...'}
									options={criterion}
									value={criterion.find(e => e.value == formData.subCriteriaId)}
									onChange={(e) => handleSelectChange('subCriteriaId', e)}
								/>
							</div>
						</div>

		
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<TextInput
									// required
									label="Gap"
									placeholder="Gap"
									value={formData.gap}
									onChange={(e) => handleChange('gap', e)}
								/>
							</div>
						</div>

						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<TextInput
									// required
									label="Integrity"
									placeholder="Integrity"
									value={formData.integrity}
									onChange={(e) => handleChange('integrity', e)}
								/>
							</div>
						</div>

						
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<TextArea
									// required
									label="Note"
									placeholder="Note"
									value={formData.note}
									onChange={(e) => handleChange('note', e)}
								/>
							</div>
						</div>
						
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="text-right mt-5">
								<button type="button" onClick={() => navigate('/gap')} className="btn btn-outline-secondary w-24 mr-1">Cancel</button>
								<button type="submit" className="btn btn-primary w-24">Save</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default ManageGap;