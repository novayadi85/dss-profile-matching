import cash from "cash-dom";
import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from "@apollo/client";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import Select from 'react-select'
import TextInput from "@components/input/TextInput";
import DatePicker from "@components/input/DatePicker";
import TextArea from "@components/input/TextArea";
import { percentage } from '@helpers/value';
import { getWeek } from '@helpers/date';
import { GET_PLAYER_WITH_SCORE_BY_WEEK, UPDATE_PlAYER_SCORE , ADD_PlAYER_SCORE } from "@gql/player";
import { GET_CRITERIA_WITH_CHILDS } from "@gql/criteria";
import { useTranslation } from "react-i18next";

const ManageScore = (props) => {
	const navigate = useNavigate()
	const { t } = useTranslation();
  	const { id } = useParams()
	const [progress, setProgress] = useState(true)
	const [recordId, setRecordId] = useState(false)
	const [nodeId, setNodeId] = useState(false)
	const [profile, setProfile] = useState(null)
	const [allCategories, setAllCategories] = useState(null)
	
	// const isUpdating = id ? id != "create" : false
	let isUpdating = false;
	const [formData, setFormData] = useState({
		player_id: id,
		week: getWeek() 
	})

	const [subCriteriaValues, setValues] = useState({

	})
	
	const percentages = percentage;

	useEffect(() => {
		cash(".editor").each(function () {
			const el = this;
			InlineEditor.create(el).catch((error) => {
				console.error(error);
			});
		});
	}, [])


	const { loading, error, data, refetch } = useQuery(GET_PLAYER_WITH_SCORE_BY_WEEK, {
		// skip: !isUpdating,
		fetchPolicy: "no-cache",
		variables: {
			nodeId: id,
			condition: {
				week: getWeek() 
			}
		},
		onCompleted: (data) => {
			const profile = data.player;
			let scores = profile?.score?.nodes ?? [];
			if (scores.length) {
				const [score] = scores;
				setRecordId(score._nodeId);
				setValues(score.value)
				isUpdating = true;
				console.log(score.value)
			}
			
		  	setProfile(profile)
		}
	})

	const criteria = useQuery(GET_CRITERIA_WITH_CHILDS, {
		fetchPolicy: "no-cache",
		variables: {
			nodeId: id,
			contains: profile?.position
		},
		onCompleted: (data) => {
		  const _allCategories = data?.allCategories?.nodes ?? [];
			setAllCategories(_allCategories)
			setProgress(false);
		}
	})


	const handleChange = (key, event) => {
		setFormData((prev) => ({ ...prev, [key]: event.target.value }))
	};

	function handleSelectChange(evt) {
		const value = evt.target.value;
		setFormData({
		  ...state,
		  [evt.target.name]: value
		});

		console.log(formData)
	}

	const handleSelectChanges = (key, event, sub = true) => {
		if (sub) {
			setValues(((prev) => ({ ...prev, [key]: event.value })))
		}
		else {
			setFormData((prev) => ({ ...prev, [key]: event.value }))
		}
	};

	const [addSCORE, { loading: addLoading }] = useMutation(ADD_PlAYER_SCORE, {
		onCompleted: (data) => {
			refetch(), navigate("/scores", { replace: true });
			
		}
	  });
	
	const [updateSCORE, { loading: updateLoading }] = useMutation(UPDATE_PlAYER_SCORE, {
		onCompleted: (data) => {
		  navigate("/scores", { replace: true });
		}
	});


	// handle form
	const handleSubmit = (e) => {
		e.preventDefault()
		let variables = formData
		variables.value = subCriteriaValues;
		variables.playerId = profile.id
		if (isUpdating || recordId) {
			variables.nodeId = recordId
			updateSCORE({ variables })
		} else {
			addSCORE({ variables })																																					
		}
	}

	console.log({
		formData,
		subCriteriaValues
	})

	useEffect(() => {
       
    });

	return (
		<>
			<div className="intro-y flex items-center mt-8">
				<h2 className="text-lg font-medium mr-auto">{isUpdating ? t("Edit") : t("Add")} {t('Score')}</h2>
			</div>
			<div className="intro-y box p-2 mt-5">
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="grid grid-cols-12">
						
						<div className="col-span-12 lg:col-span-12 px-3 pt-3 pb-0">
							<h4 className="font-bold mb-0"></h4>
						</div>

						<div className="col-span-6 lg:col-span-6 p-3">
							<TextInput
								// required
								label={t("Player Name")}
								placeholder="Player Name"
								value={(profile?.name) ?? null }
								disabled={true}
							/>
						</div>
						<div className="col-span-6 lg:col-span-6 p-3">
							<TextInput
								// required
								label={t("Number")}
								placeholder="Player Number"
								value={(profile?.backNumber) ?? null }
								disabled={true}
							/>
						</div>

						{(!progress) ? (
							<>
								{allCategories.map(category => {
									return (
										<>
											<div className="col-span-6 lg:col-span-6 p-3">
												<div className="mt-2">
													<div className="col-span-12 lg:col-span-12 pb-0">
														<h2 style={{
															borderBottom: '1px solid #0000002b',
															background: '#edf2f7',
															padding: '10px',
															margin: '0 0 10px'
														}} className="font-bold mb-0"> {category.title}</h2>
													</div>
													{category.subCriteria.nodes.map(subCriteria => {
														//console.log()
														if (subCriteria?.position && subCriteria.position.includes(profile?.position)) {
															let options = percentages;
															console.log(subCriteria)
															if (subCriteria?.values?.nodes && subCriteria?.values?.totalCount) {
																options = subCriteria.values.nodes.map(opt => {
																	return {
																		label: `${opt.name} (${opt.value})`,
																		value: opt.value
																	}
																})
															}
															return (
																<div className="mt-4">
																	<label htmlFor="crud-form-6" className="form-label"> {subCriteria.name}</label>
																	<Select
																		id="crud-form-6"
																		placeholder={t("Choose One..")}
																		options={options}
																		value={options.find(e => {
																			if (subCriteriaValues[subCriteria.id] && e.value === subCriteriaValues[subCriteria.id]) {
																				return true
																			}
																			
																			return false
																		} )}
																		onChange={(e) => handleSelectChanges(subCriteria.id, e)}
																	/>
																	<p className="form-help">{t("Ideal Value")}: {subCriteria.idealValue}</p>
																</div>
															)
														}
													})}

													{(category.subCriteria.totalCount <= 0 ) ? (<p>{t("Not Criteria found")}</p>) : (null)}
													
												</div>
											</div>
										</>
									)
								})}
								
							</>
						): (
								null
						) }
						
						
							
						
						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="text-right mt-5">
								<button type="button" onClick={() => navigate('/players')} className="btn btn-outline-secondary w-24 mr-1">{t('Cancel')}</button>
								<button type="submit" className="btn btn-primary w-24">{t('Save')}</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default ManageScore;