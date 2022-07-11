import cash from "cash-dom";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from "@apollo/client";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import TextInput from "@components/input/TextInput";
import { REGISTER_DATA, GET_USER } from "@gql/users";


const ManageUser = (props) => {
	const navigate = useNavigate();
	const { id } = useParams()
	const [recordId, setRecordId] = useState(false)
	const [nodeId, setNodeId] = useState(false)
	const isUpdating = id ? id != "create" : false

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		password: '',
		confirmPassword: '',
		email: '',
	})


	const { loading, error, data } = useQuery(GET_USER, {
		skip: !isUpdating,
		variables: {
		  nodeId: id,
		},
		onCompleted: (data) => {
		  const user = data.user;
		  const formDatas = {
			firstName: user.firstName,
			lastName: user.lastName, 
			email: user.email,
		  }

		  setRecordId(user.id);
		  setNodeId(user._nodeId);
		  setFormData(formDatas)
		}
	})

	useEffect(() => {
		cash(".editor").each(function () {
			const el = this;
			InlineEditor.create(el).catch((error) => {
				console.error(error);
			});
		});
	}, [])

	const addList = (key, object) => {
		formData[key].push(object)
		setFormData((prev) => ({
			...prev,
			[key]: formData[key]
		}))
	}

	const removeList = (deletedIndex, key) => {
		if (formData[key].length > 1) {
			const newList = formData[key].filter((item, index) => index != deletedIndex)
			setFormData((prev) => ({
				...prev,
				[key]: newList
			}))
		}
	}

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
	}

	return (
		<>
			<div className="intro-y flex items-center mt-8">
				<h2 className="text-lg font-medium mr-auto">Add User</h2>
			</div>
			<div className="intro-y box p-2 mt-5">
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="grid grid-cols-12">
						
						<div className="col-span-12 lg:col-span-12 px-3 pt-3 pb-0">
							<h4 className="font-bold mb-0">USER ACCOUNT</h4>
						</div>
						<div className="col-span-12 lg:col-span-12 p-3">
							<TextInput
								// required
								label="First Name"
								placeholder="First Name"
								value={formData.firstName}
								onChange={(e) => handleChange('firstName', e)}
							/>
							<TextInput
								// required
								label="Last Name"
								placeholder="Last Name"
								value={formData.lastName}
								onChange={(e) => handleChange('lastName', e)}
							/>
							<TextInput
								// required
								label="Email"
								placeholder="example@email.com"
								value={formData.email}
								onChange={(e) => handleChange('email', e)}
							/>
							<TextInput
								// required
								type="password"
								label="Password"
								placeholder="Password"
								value={formData.password}
								onChange={(e) => handleChange('password', e)}
							/>
							<TextInput
								// required
								type="password"
								label="Confirm Password"
								placeholder="Confirm Password"
								value={formData.confirmPassword}
								onChange={(e) => handleChange('confirmPassword', e)}
							/>
						</div>
						
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="text-right mt-5">
								<button onClick={() => navigate('/users')} type="button" className="btn btn-outline-secondary w-24 mr-1">Cancel</button>
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