import cash from "cash-dom";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from "@apollo/client";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import TextInput from "@components/input/TextInput";
import { UPDATE_USER, GET_USER, GET_ACCOUNT, MODIFY_ACCOUNT } from "@gql/users";
import { useTranslation } from "react-i18next";


const ManageUser = (props) => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { id } = useParams()
	const [recordId, setRecordId] = useState(false)
	const [errorMessage, setErrorMessage] = useState(false)
	const [nodeId, setNodeId] = useState(false)
	const isUpdating = id ? id != "create" : false

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		password: '',
		confirmPassword: '',
		email: '',
	})

	const [getAccount] = useMutation(GET_ACCOUNT, {
		variables: {
		  nodeId: id,
		},
		onCompleted: (data) => {
		  const userAccount = data?.userAccountById?.userAccount;
			setFormData((prev) => ({
				...prev,
				email: userAccount.email
			}));
		}
	})	

	const [updateAccount, {error: errorSave}] = useMutation(MODIFY_ACCOUNT, {
		variables: {
		  userid: recordId,
		  firstname: formData.firstName,
		  lastname: formData.lastName,
		  password: formData.password,
		  username: formData.email
		},
		onCompleted: (data) => {
			navigate("/users", { replace: true });
		}
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
			getAccount({
				variables: {
					id: user.id
				}
			});
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

	const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
		onCompleted: (data) => {
		   // navigate("/users", { replace: true });
			
		}
	});

	// handle form
	const handleSubmit = (e) => {
		e.preventDefault()
		let variables = formData
		variables._nodeId = nodeId;
	 	// updateUser({ variables })  
		if (variables.password === '' || variables.password != variables.confirmPassword) {
			setErrorMessage(true);
		}
		else {
			setErrorMessage(false);
			updateAccount()
		}
		
	}

	return (
		<>
			<div className="intro-y flex items-center mt-8">
				<h2 className="text-lg font-medium mr-auto">{ t('Add User')}</h2>
			</div>
			<div className="intro-y box p-2 mt-5">
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="grid grid-cols-12">
						
						<div className="col-span-12 lg:col-span-12 px-3 pt-3 pb-0">
							<h4 className="font-bold mb-0">{ t('Detail User')}</h4>
						</div>
						<div className="col-span-12 lg:col-span-12 p-3">
							<TextInput
								// required
								label={ t('First Name')}
								placeholder="First Name"
								value={formData.firstName}
								onChange={(e) => handleChange('firstName', e)}
							/>
							<TextInput
								// required
								label={ t('Last Name')}
								placeholder="Last Name"
								value={formData.lastName}
								onChange={(e) => handleChange('lastName', e)}
							/>
							<TextInput
								// required
								label="Username"
								value={formData.email ? formData.email : ""}
								// onChange={(e) => handleChange('email', e)}
								disabled={true}
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
								<button onClick={() => navigate('/users')} type="button" className="btn btn-outline-secondary w-24 mr-1">{ t('Cancel')}</button>
								<button type="submit" className="btn btn-primary w-24">{ t('Save')}</button>
							</div>
						</div>
					</div>
					{(errorSave || errorMessage) && <p>Error : {t('Please try again')}</p>}
				</form>
			</div>
		</>
	);
}

export default ManageUser;