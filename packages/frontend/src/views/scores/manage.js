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

const ManageScore = (props) => {
	const navigate = useNavigate()
  	const { id } = useParams()
	const [recordId, setRecordId] = useState(false)
	const [nodeId, setNodeId] = useState(false)
	const isUpdating = id ? id != "create" : false
	const [formData, setFormData] = useState({
		birth: '',
		clubFrom:'',
		joinDate: '',
		name:'',
		position:''
	})
	
	const positionOptions = [
		{ value: 'GK', label: 'Goal Keeper' },
		{ value: 'CB', label: 'Center Back' },
		{ value: 'LF', label: 'Left Back' },
		{ value: 'RB', label: 'Right Back' },
		{ value: 'RWF', label: 'Right Wing Forward' },
		{ value: 'LWF', label: 'Left Wing Forward' },
		{ value: 'CMF', label: 'Center Middle Forward' },
		{ value: 'DM', label: 'Defensive Midfielder' },
		{ value: 'CF', label: 'Center Forward' },
	]

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
			clubFrom: player.clubFrom,
			joinDate: player.joinDate,
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
				<h2 className="text-lg font-medium mr-auto">{isUpdating ? "Edit" : "Add"} Score</h2>
			</div>
			<div className="intro-y box p-2 mt-5">
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="grid grid-cols-12">
						
						<div className="col-span-12 lg:col-span-12 px-3 pt-3 pb-0">
							<h4 className="font-bold mb-0"></h4>
						</div>
						<div className="col-span-6 lg:col-span-6 p-3">
							<div className="mt-2">
								<label htmlFor="crud-form-6" className="form-label">Player <span className="text-theme-6">*</span></label>
								<Select
									id="crud-form-6"
									placeholder={'Choose One...'}
									options={positionOptions}
									value={positionOptions.find(e => e.value == formData.position)}
									onChange={(e) => handleSelectChange('position', e)}
								/>
							</div>
						</div>

						<div className="col-span-6 lg:col-span-8 p-3">
							<TextInput
								// required
								label="Join date"
								placeholder="Join date"
								value={formData.joinDate}
								onChange={(e) => handleChange('joinDate', e)}
							/>

							<DatePicker
								// required
								label="Club From"
								placeholder="Club From"
								value={formData.clubFrom}
								onChange={(e) => handleChange('clubFrom', e)}
							/>

							<TextArea
								// required
								label="Note"
								placeholder="Note"
								value={formData.note}
								onChange={(e) => handleChange('note', e)}
							/>

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

export default ManageScore;