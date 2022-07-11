import cash from "cash-dom";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useMutation, useQuery } from "@apollo/client";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import Select from 'react-select'
import TextInput from "@components/input/TextInput";
import { ADD_CRITERIA, UPDATE_CRITERIA } from "@gql/criteria";
import { QUERY_ALL_CATEGORY } from "@gql/category";
import { GET_CRITERIA, QUERY_ALL_SUB_CRITERIA } from "@gql/criteria";
import Table from '@components/Table';
import { positions } from '../../helpers/position';

const ManageUser = (props) => {
	const navigate = useNavigate()
  	const { id } = useParams()
	const isUpdating = id ? id != "create" : false
	const [recordId, setRecordId] = useState(false)
	const [nodeId, setNodeId] = useState(false)
	const [categories, setCategories] = useState([])
	
	const [formData, setFormData] = useState({
		name: '',
		type:'',
		position: '',
		idealValue: '',
		parentId: ''
	}) 
	
	const [open, setOpen] = useState(false)
	const [subCriteria, setSubCriteria] = useState({})
  	const [selectedId, setSelectedId] = useState("")
  
	const typeOptions = [
		{ value: 'CORE', label: 'CORE' },
		{ value: 'SECONDARY', label: 'SECONDARY' }
	]

	useEffect(() => {
		cash(".editor").each(function () {
			const el = this;
			InlineEditor.create(el).catch((error) => {
				console.error(error);
			});
		});
	}, [])


	const { loading, error, data } = useQuery(GET_CRITERIA, {
		skip: !isUpdating,
		variables: {
		  nodeId: id,
		},
		onCompleted: (data) => {
		  const criterion = data.criterion;
		  const formDatas = {
			name: criterion.name,
			type: criterion.type, 
			position: criterion.position, 
			  idealValue: criterion.idealValue, 
			parentId: criterion.parentId
		  }

		  setRecordId(criterion.id);
		  setNodeId(criterion._nodeId);
		  setFormData(formDatas)
		}
	})

	useQuery(QUERY_ALL_CATEGORY, {
		variables: {
			first: 10,
		},
		onCompleted: (data) => {
			let options = data.allCategories.nodes.map(node => {
				return {
					label: node.title,
					value: node.id
				}
			})
			setCategories(options);
		}
	});

	const [addCriteria, { loading: addLoading }] = useMutation(ADD_CRITERIA, {
		
		onCompleted: (data) => {
			const { createCriterion } = data
		  navigate(`/criteria/${createCriterion.criterion._nodeId}`, { replace: true });
		}
	  });
	
	const [updateCriteria, { loading: updateLoading }] = useMutation(UPDATE_CRITERIA, {
		onCompleted: (data) => {
			const { updateCriterion } = data
		  navigate(`/criteria/${updateCriterion.criterion._nodeId}`, { replace: true });
		}
	});


	const handleChange = (key, event) => {
		let val = event.target.value;
		if(key === 'idealValue') val = Number(val);
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
		let variables = formData
		variables.idealValue = Number(variables.idealValue)
		if (isUpdating) {
			variables.nodeId = id
			updateCriteria({ variables })
		} else {
			addCriteria({ variables })
		}
	}

	const columns = [
		//{ title: "id", field: "id", width: 100 },
		{ title: "Condition", field: "name" },
		{ title: "Value", field: "value" },
	]
  
	const searchFieldName = ["name"]

	const tableAction = (cell) => {
		console.log(cell)
		const { action, row } = cell
		switch (action) {
		  case "delete":
			setSelectedId(row._nodeId)
			setOpen(true)
			break;
	
		  case "edit":
			navigate(`/sub-criteria/edit/${row._nodeId}`)
			break;
	
		  default:
			break;
		}
	  }

	return (
		<>
			<div className="intro-y flex items-center mt-8">
				<h2 className="text-lg font-medium mr-auto">Add Criteria</h2>
			</div>
			<div className="intro-y box p-2 mt-5">
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="grid grid-cols-12">
						
						<div className="col-span-12 lg:col-span-12 px-3 pt-3 pb-0">
							<h4 className="font-bold mb-0">CRITERIA</h4>
						</div>

						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<label htmlFor="crud-form-6" className="form-label">Category<span className="text-theme-6">*</span></label>
								<Select
									id="crud-form-6"
									placeholder={'Choose a category...'}
									options={categories}
									value={categories.find(e => e.value == formData.parentId)}
									onChange={(e) => handleSelectChange('parentId', e)}
								/>
							</div>
						</div>
						
						<div className="col-span-6 lg:col-span-8 p-3">
							<TextInput
								// required
								label="Name"
								placeholder="Name"
								value={formData.name}
								onChange={(e) => handleChange('name', e)}
							/>

						</div>
			
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<label htmlFor="crud-form-6" className="form-label">Type <span className="text-theme-6">*</span></label>
								<Select
									id="crud-form-6"
									placeholder={'Choose One...'}
									options={typeOptions}
									value={typeOptions.find(e => e.value == formData.type)}
									onChange={(e) => handleSelectChange('type', e)}
								/>
							</div>
						</div>

						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<label htmlFor="crud-form-6" className="form-label">Position<span className="text-theme-6">*</span></label>
								<Select
									id="crud-form-6"
									placeholder={'Choose a position...'}
									options={positions}
									value={positions.find(e => e.value == formData.position)}
									onChange={(e) => handleSelectChange('position', e)}
								/>
							</div>
						</div>

						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								
								<TextInput
								// required
							       label="Value Std"
								    placeholder="Value Std"
								    value={formData.idealValue}
								    onChange={(e) => handleChange('idealValue', e)}
							/>
							</div>
						</div>


						
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="text-right mt-5">
								<button type="button" onClick={() => navigate('/criteria')} className="btn btn-outline-secondary w-24 mr-1">Cancel</button>
								<button type="submit" className="btn btn-primary w-24">Save</button>
							</div>
						</div>
					</div>
				</form>
			</div>
			{(recordId !== false) ? (
				<>
					<div className="intro-y flex flex-col sm:flex-row items-center mt-8">
						<h2 className="text-lg font-medium mr-auto">
							{'Sub Criteria data'}
						</h2>
						<div className="w-full sm:w-auto flex mt-4 sm:mt-0">
						<Link to={'/sub-criteria/add/'+nodeId} className="btn btn-dark mb-2">Add New SubCriteria</Link>
						</div>
					</div>

					<Table query={QUERY_ALL_SUB_CRITERIA} columns={columns} option={
						{
						//paginationSize: 2,
						//paginationSizeSelector: [2, 100, 200, 300, 400, 500],
							condition : {
								parentId: recordId
							}
						}
					}
						action={true}
						callback={tableAction}
						searchFieldName={searchFieldName}
					/>
				</>
			) : (
				<></>
			)}
			
		</>
	);
}

export default ManageUser;