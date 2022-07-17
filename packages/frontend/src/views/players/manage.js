import cash from "cash-dom";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from "@apollo/client";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import dayjs from "dayjs";
import Litepicker from "litepicker";
import Select from 'react-select';
import TextInput from "@components/input/TextInput";
import TextArea from "@components/input/TextArea";
import { FileUploader } from "react-drag-drop-files";
import { ADD_PlAYER, UPDATE_PLAYER, GET_PLAYER } from "@gql/player";
import { positions } from "@helpers/position";
import DatePicker from "@components/input/DatePicker";
const env = process.env;

const defaultImage = '/logo512.png';

const ManageUser = (props) => {
	const navigate = useNavigate()
  	const { id } = useParams()
	const [recordId, setRecordId] = useState(false)
	const [photo, setPhoto] = useState(defaultImage)
	const [nodeId, setNodeId] = useState(false)
	const isUpdating = id ? id != "create" : false
	const [formData, setFormData] = useState({
		birth: '2000-01-01',
		phone:'',
		backNumber: '',
		address: '',
		name:'',
		position: ''
	})

	useEffect(() => {
		cash(".editor").each(function () {
			const el = this;
			InlineEditor.create(el).catch((error) => {
				console.error(error);
			});
		});
		cash(".datepicker").each(function () {
			let options = {
				autoApply: true,
				singleMode: true,
				showWeekNumbers: true,
				format: "YYYY-MM-DD",
				dropdowns: {
					minYear: 1990,
					maxYear: null,
					months: true,
					years: true,
				},
				setup: (picker) => {
					picker.on('selected', (date) => {
						setFormData((prev) => ({ ...prev, ['birth']: cash(this).val() }))
					});
				}

			};
	

			if (cash(this).data("format")) {
				options.format = cash(this).data("format");
			}
	
			if (!cash(this).val()) {
				let date = dayjs().format(options.format);
				date += !options.singleMode
					? " - " + dayjs().add(1, "month").format(options.format)
					: "";
				cash(this).val(date);
			}
	
			new Litepicker({
				element: this,
				...options,
			});
		});
	}, [])

	const { loading , data } = useQuery(GET_PLAYER, {
		skip: !isUpdating,
		variables: {
		  nodeId: id,
		},
		onCompleted: (data) => {
		  const player = data.player;
		  const formDatas = {
			name: player.name,
			birth: player.birth,
			phone: player.phone,
			backNumber: player.backNumber,
			address: player.address,
			position: player.position,
			// photo: player.photo != '' ? player.photo : ''
		  }

		  setRecordId(player.id);
		  setPhoto(player.photo);
		  setNodeId(player._nodeId);
		  setFormData(formDatas)
		}
	})

	const [addPlayer, { loading: addLoading, error }] = useMutation(ADD_PlAYER, {
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
		// console.log(event.target)
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

	/*
	const handleFileChange = (key, file) => {
		setFormData((prev) => ({
			...prev,
			file: {
				...prev.file,
				[key]: file
			}
		}));
	};
	*/

	const fileTypes = ['jpg', 'png'];
	const [file, setFile] = useState(null);
	
	const handleFileChange = (file) => {
		setFile(file);
		console.log(file)
	};

	// handle form
	const handleSubmit = (e) => {
		e.preventDefault()
		let variables = formData
		if (file) variables.photo = file;

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
						<div className="col-span-6 lg:col-span-6 px-3 pt-3 pb-0">
							<div className="col-span-12 lg:col-span-12 px-3 pt-3 pb-0">
								<h4 className="font-bold mb-0"></h4>
							</div>
							<div className="col-span-12 lg:col-span-12 p-3">
								<div className="mt-2 w-full">
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
								<div className="mt-2 w-full">
									<DatePicker
										// required
										label="Birth day"
										placeholder="Birth day"
										value={formData.birth}
										onChange={(e) => handleChange('birth', e)}
									/>
								</div>
							</div>

							<div className="col-span-12 lg:col-span-12 p-3">
								<div className="mt-2 w-full">
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
								<div className="mt-2 w-full">
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
						<div className="col-span-6 lg:col-span-6 px-3 pt-3 pb-0">
							<div className="d-flex flex-1 px-5 align-items-center justify-content-center justify-content-lg-start">
								<div className="w-full h-100 my-5 max-h-full">
									<img style={{margin: '0 auto'}}  className="image-relative" src={(photo === defaultImage || null === photo) ? `${defaultImage}`: `${env.REACT_APP_FILE_DESTINATION}${photo}`}/> 
								</div>
							</div>
							<div className="col-span-12 lg:col-span-12 p-3">
								<div className="text-left mt-5 ml-5 mr-5">
									<label className="form-label">Photo (400x200)<span className="text-theme-6"></span></label>
									<FileUploader handleChange={handleFileChange} name="ktp" types={fileTypes} />
								</div>
							</div>
							
						</div>
					</div>
				</form>
				{error && <p>Error : Please try again</p>}
			</div>
		</>
	);
}

export default ManageUser;