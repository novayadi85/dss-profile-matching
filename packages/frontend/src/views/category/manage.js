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
import { ADD_CATEGORY, GET_CATEGORY, UPDATE_CATEGORY } from "../../apollo/category";
import { useTranslation } from "react-i18next";

const ManageGap = (props) => {
	const { t } = useTranslation();
	const navigate = useNavigate()
  	const { id } = useParams()
	const isUpdating = id ? id != "create" : false
	const [formData, setFormData] = useState({
		title: null,
        percentage: null,
	})

	useEffect(() => {
		cash(".editor").each(function () {
			const el = this;
			InlineEditor.create(el).catch((error) => {
				console.error(error);
			});
		});
    }, [])
    

	const { loading, error, data } = useQuery(GET_CATEGORY, {
		skip: !isUpdating,
		variables: {
		  nodeId: id,
		},
		onCompleted: (data) => {
		  const category = data.category;
		  const formDatas = {
			title: category.title,
			percentage: category.percentage, 
		  }

		  setFormData(formDatas)
		}
	})

	const [add, { loading: addLoading }] = useMutation(ADD_CATEGORY, {
		onCompleted: (data) => {
		  navigate("/category", { replace: true });
		}
	  });
	
	const [update, { loading: updateLoading }] = useMutation(UPDATE_CATEGORY, {
		onCompleted: (data) => {
		  navigate("/category", { replace: true });
		}
	});


	const handleChange = (key, event) => {
		setFormData((prev) => ({ ...prev, [key]: event.target.value }))
	};

	// handle form
	const handleSubmit = (e) => {
		e.preventDefault()
        let variables = formData
        variables.percentage = Number(variables.percentage)
		if (isUpdating) {
			variables.nodeId = id
			update({ variables })
		} else {
			add({ variables })
		}
	}

	return (
		<>
			<div className="intro-y flex items-center mt-8">
				<h2 className="text-lg font-medium mr-auto">{isUpdating ? t("Edit") : t("Add")} {t("Category")}</h2>
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
									label={t("Title")}
									placeholder="Title"
									value={formData.title}
									onChange={(e) => handleChange('title', e)}
								/>
							</div>
						</div>

						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="mt-2 w-2/4">
								<TextInput
									// required
									label={t("Percentage")}
									placeholder="Percentage"
									value={formData.percentage}
									onChange={(e) => handleChange('percentage', e)}
								/>
							</div>
						</div>

						<div className="col-span-12 lg:col-span-12 p-3">
							<div className="text-right mt-5">
								<button type="button" onClick={() => navigate('/category')} className="btn btn-outline-secondary w-24 mr-1">{t("Cancel")}</button>
								<button type="submit" className="btn btn-primary w-24">{t("Save")}</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default ManageGap;