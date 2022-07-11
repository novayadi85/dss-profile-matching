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
import { ADD_PlAYER, UPDATE_PLAYER, GET_PLAYER } from "@gql/player";
import { positions } from "../../helpers/position";

const ManageUser = (props) => {
	const navigate = useNavigate()
  	const { id } = useParams()
	const [recordId, setRecordId] = useState(false)
	const [nodeId, setNodeId] = useState(false)
	const isUpdating = id ? id != "create" : false
	const [formData, setFormData] = useState({
		birth: '2000-01-01',
		phone:'',
		backNumber: '',
		address: '',
		name:'',
		position:''
	})

	useEffect(() => {
		cash(".editor").each(function () {
			const el = this;
			InlineEditor.create(el).catch((error) => {
				console.error(error);
			});
		});
	}, [])

	const { loading, error, data } = useQuery(GET_PLAYER, {
		skip: !isUpdating,
		variables: {
		  nodeId: id,
		},
		onCompleted: (data) => {
		  const player = data.player;
		  const formDatas = {
			name: player.name,
			type: player.type, 
			birth: player.birth,
			phone: player.phone,
			backNumber: player.backNumber,
			address: player.address,
			position:player.position,
		  }

		  setRecordId(player.id);
		  setNodeId(player._nodeId);
		  setFormData(formDatas)
		}
	})

	const [addPlayer, { loading: addLoading }] = useMutation(ADD_PlAYER, {
		onCompleted: (data) => {
		  navigate("/players", { replace: true });
		}
	  });
	
	const [updatePlayer, { loading: updateLoading }] = useMutation(UPDATE_PLAYER, {
		onCompleted: (data) => {
		  navigate("/players", { replace: true });
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
				<h2 className="text-lg font-medium mr-auto">{isUpdating ? "Edit" : "Add"} Player</h2>
			</div>
			<div className="intro-y box p-2 mt-5">
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="grid grid-cols-12">
						
						<div className="col-span-12 lg:col-span-12 px-3 pt-3 pb-0">
							<h4 className="font-bold mb-0"></h4>
						</div>
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<TextInput
									// required
									label="Full name"
									placeholder="Full Name"
									value={formData.name}
									onChange={(e) => handleChange('name', e)}
								/>

							</div>
						</div>

						<div className="col-span-6 lg:col-span-6 p-3">
							<div className="mt-2">
								<label htmlFor="crud-form-6" className="form-label">Position <span className="text-theme-6">*</span></label>
								<Select
									id="crud-form-6"
									placeholder={'Choose One...'}
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
									label="Back Number"
									placeholder="Back Number"
									value={formData.backNumber}
									onChange={(e) => handleChange('backNumber', e)}
								/>
							</div>
						</div>

						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<TextInput
									// required
									label="Date of Birth"
									placeholder="Date of Birth"
									value={formData.birth}
									onChange={(e) => handleChange('birth', e)}
								/>
							</div>
						</div>

						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<TextInput
									// required
									label="Phone"
									placeholder="Phone"
									value={formData.phone}
									onChange={(e) => handleChange('phone', e)}
								/>			
							</div>
						</div>
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<TextArea
									// required
									label="Address"
									placeholder="Address"
									value={formData.address}
									onChange={(e) => handleChange('address', e)}
								/>
							</div>
						</div>
						
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="text-right mt-5">
								<button type="button" onClick={() => navigate('/players')} className="btn btn-outline-secondary w-24 mr-1">Cancel</button>
								<button type="submit" className="btn btn-primary w-24">Save</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default ManageUser;