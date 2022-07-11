import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { X, CheckCircle } from 'react-feather'
import { Grid, TailSpin } from 'react-loader-spinner'
import { setLogin } from '@store/auth/action'

import { REGISTER_MUTATION, REGISTER_DATA } from "@gql/users";

import GlobalLayout from "@components/layout/globalLayout";

import Logo from "@assets/images/logo.svg";
import Illustration from "@assets/images/illustration.svg";

import { FileUploader } from "react-drag-drop-files";
import TextInput from "../../components/input/TextInput";
import { formErrorMessage, validateFieldRequired, validatePassword } from "../../helpers/validators";

const SignUp = () => {
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState("")
  const [errName, setErrName] = useState("")
  const [errContactEmail, setErrContactEmail] = useState("")
  const [errEmail, setErrEmail] = useState("")
  const [errTitle, setErrTitle] = useState("")
  const [errPassword, setErrPassword] = useState("")

  const [createUser, { loading: isLoading }] = useMutation(REGISTER_MUTATION, {
    onError: (data) => {
      setErrorMessage(data.message)
    },
    onCompleted: (data) => {
      setStatus(true)
      dispatch(setLogin(data.register))
    }
  });
  const { isLogin } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [contactPerson, setContactPerson] = useState({
    email: "",
    first_name: "",
    position: "",
  })
  const [formData, setFormData] = useState({
    // bank_detail: RegisterBankInput {
    //   account_number: String
    //   bank_address: String
    //   bank_id: Int!
    //   created_by: Int
    //   deleted_at: Time
    //   swift_code: String
    // },
    city: 'Madiun',
    // required
    country_id: 209,
    credit_limit: "",
    email: "example@mail.com", //required
    full_address: "full address",
    full_name: "fullname",
    name: "Company Name",
    password: "1234", //required
    phone: "90909090",
    postal_code: "999000",
    status: false,
    text: "",
    title: 'CV', //required
    upload_files: null,
    vat: "-",
  });

  const { loading, error, data } = useQuery(REGISTER_DATA);

  const countryList = data?.allCountries?.nodes ?? []
  const bankList = data?.allBanks?.nodes ?? []

  const countryOptions = countryList.map((e) => {
    return { value: e.id, label: e.countryName.trim() }
  })
  const bankOptions = bankList.map((e) => {
    return { value: e.id, label: e.name.trim() }
  })

  const isValid = () => {

    const nameMsg = formErrorMessage(validateFieldRequired(formData.name))
    if (nameMsg) setErrName(nameMsg)

    const contactEmailMsg = formErrorMessage(
      validateFieldRequired(contactPerson.email) || validateFieldRequired(contactPerson.email)
    )
    if (contactEmailMsg) setErrContactEmail(contactEmailMsg)

    const emailMsg = formErrorMessage(
      validateFieldRequired(formData.email) || validateFieldRequired(formData.email)
    )
    if (emailMsg) setErrEmail(emailMsg)

    const passwordMsg = formErrorMessage(
      validatePassword(formData.password)
    )
    if (passwordMsg) setErrPassword(passwordMsg)


    if (nameMsg || contactEmailMsg || emailMsg || passwordMsg) {
      return false
    }

    return true

  }

  const handlingSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      return
    }

    createUser({
      variables: {
        input: { ...formData, contact_person: contactPerson },
      },
    })
  };

  const handleChange = (key = "company", event) => {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSelectChange = (key, event) => {
    setFormData((prev) => ({ ...prev, [key]: event.value }));
  };

  const optTitle = [
    { value: "PT", label: "PT" },
    { value: "CV", label: "CV" },
    { value: "Individu", label: "Individu" },
  ];

  const fileTypes = ['pdf'];
  const [file, setFile] = useState(null);
  const handleFileChange = (file) => {
    setFile(file);
  };

  const renderError = (error = []) =>
    error.map((e) => <li key={e}>{e.message}</li>);
  useEffect(() => {
    if (isLogin) {
      navigate("/", { replace: true });
    }
  }, [isLogin, navigate]);

  if (loading || isLoading) {
    return (
      <div className="flex flex-col w-full h-screen justify-center items-center">
        <Grid
          heigth="75"
          width="75"
          color='#00BFFF'
          arialLabel='loading'
        />
        <h2 className="text-2xl text-white mt-3">Loading...</h2>
      </div>
    )
  }

  return (
    <GlobalLayout>
      <div className="block xl:grid grid-cols-2 gap-4">
        <div className="hidden xl:flex flex-col min-h-screen">
          <a href="/" className="intro-x flex items-center pt-5">
            <img
              alt="Rubick Tailwind HTML Admin Template"
              className="w-6"
              src={Logo}
            />
            <span className="text-white text-lg ml-3">
              PMS<span className="font-medium">INTA</span>
            </span>
          </a>
          <div className="my-auto">
            <img
              alt="Rubick Tailwind HTML Admin Template"
              className="-intro-x w-1/2 -mt-16"
              src={Illustration}
            />
            <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
              A few more clicks to
              <br />
              sign in to your account.
            </div>
            <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-gray-500">
              Manage all your accounts in one place
            </div>
          </div>
        </div>
        <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-4 overscroll-contain">
          <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
              Sign Up
            </h2>
            <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">
              A few more clicks to sign in to your account. Manage all your accounts in one place
            </div>
            {status && (
              <div className="alert alert-success alert-dismissible show flex items-center mb-2" role="alert">
                <CheckCircle />
                Register Success
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                  <X />
                </button>
              </div>
            )}
            {errorMessage && (
              <div className="show mb-2 alert alert-danger alert-dismissible" role="alert">
                <div className="flex items-center">
                  <div className="font-medium text-lg">{errorMessage}</div>
                  <div className="text-xs bg-white px-1 rounded-md text-gray-800 ml-auto">New</div>
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close">
                    <X />
                  </button>
                </div>
                <div className="w-full mt-2">
                  <ol className="list-disc">
                    {errorMessage}
                    {/* {renderError(
                      createUserResponse.error?.networkError?.result?.errors || createUserResponse.error?.graphQLErrors
                    )} */}
                  </ol>
                </div>
              </div>
            )}
            {isLoading && <div className="flex justify-center">
              <TailSpin type="TailSpin" color="#00BFFF" height={50} width={50} />
            </div>}
            <form action="#" onSubmit={handlingSubmit}>
              <div className="intro-x mt-8">
                <div className="form-group mt-2">
                  <label className="form-label">Title <span className="text-theme-6">*</span></label>
                  <Select
                    placeholder="Choose One"
                    isSearchable
                    options={optTitle}
                    value={optTitle.find(e => e.value == formData.title)}
                    onChange={(e) => handleSelectChange('title', e)}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Company Name <span className="text-theme-6">*</span></label>
                  <TextInput
                    value={formData.name}
                    placeholder="Company Name"
                    onChange={(e) => handleChange('name', e)}
                    errorMessage={errName}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Full Address <span className="text-theme-6">*</span></label>
                  <textarea
                    rows={6}
                    className="form-control"
                    placeholder="Full Address"
                    value={formData.full_address}
                    onChange={(e) => handleChange("full_address", e)}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Postalcode <span className="text-theme-6">*</span></label>
                  <TextInput
                    value={formData.postal_code}
                    placeholder="Postalcode"
                    onChange={(e) => handleChange("postal_code", e)}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">City <span className="text-theme-6">*</span></label>
                  <TextInput
                    value={formData.city}
                    placeholder="City"
                    onChange={(e) => handleChange("city", e)}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Country <span className="text-theme-6">*</span></label>
                  <Select
                    placeholder="Choose One"
                    isSearchable
                    options={countryOptions}
                    value={countryOptions.find(e => e.value == formData.country_id)}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, country_id: e.value }));
                    }}
                  />
                </div>

                {formData.country_id == 209 && <div className="form-group mt-2">
                  <label className="form-label">Tax Registered Number / NPWP <span className="text-theme-6">*</span></label>
                  <TextInput
                  value={formData.vat}
                  placeholder="Tax Registered Number / NPWP"
                  onChange={(e) => handleChange("vat", e)}
                />
                </div> }

                <div className="form-group mt-2">
                  <label className="form-label">Office Phone <span className="text-theme-6">*</span></label>
                  <TextInput
                    value={formData.phone}
                    placeholder="Office Phone"
                    onChange={(e) => handleChange("phone", e)}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Bank Name <span className="text-theme-6">*</span></label>
                  <Select
                    placeholder="Choose One"
                    isSearchable
                    options={bankOptions}
                    value={bankOptions.find(e => e.value == formData.bank_detail?.bank_id)}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, bank_detail: { bank_id: e.value } }));
                    }}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Contact Person Name <span className="text-theme-6">*</span></label>
                  <TextInput
                    placeholder="Contact Person Name"
                    value={contactPerson.first_name}
                    onChange={(e) => {
                      setContactPerson((prev) => ({ ...prev, first_name: e.target.value }));
                    }}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Contact Person Email <span className="text-theme-6">*</span></label>
                  <TextInput
                    placeholder="Contact Person Email"
                    value={contactPerson.email}
                    onChange={(e) => {
                      setContactPerson((prev) => ({ ...prev, email: e.target.value }));
                    }}
                    errorMessage={errContactEmail}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Contact Person Position <span className="text-theme-6">*</span></label>
                  <TextInput
                    placeholder="Contact Person Position"
                    value={contactPerson.position}
                    onChange={(e) => {
                      setContactPerson((prev) => ({ ...prev, position: e.target.value }));
                    }}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Company Description <span className="text-theme-6">*</span></label>
                  <TextInput
                    placeholder="Company Description"
                    value={formData.text}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, text: e.target.value }));
                    }}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">KTP <span className="text-theme-6">*</span></label>
                  <FileUploader handleChange={handleFileChange} name="ktp" types={fileTypes} />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">NPWP <span className="text-theme-6">*</span></label>
                  <FileUploader handleChange={handleFileChange} name="npwp" types={fileTypes} />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">SIUP <span className="text-theme-6">*</span></label>
                  <FileUploader handleChange={handleFileChange} name="siup" types={fileTypes} />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Credit Limit <span className="text-theme-6">*</span></label>
                  <TextInput
                    value={formData.credit_limit}
                    placeholder="Credit Limit"
                    onChange={(e) => handleChange("credit_limit", e)}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Company Email (Using for login to PMS) <span className="text-theme-6">*</span></label>
                  <TextInput
                    placeholder="Enter your email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e)}
                    errorMessage={errEmail}
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="form-label">Password <span className="text-theme-6">*</span></label>
                  <TextInput
                    placeholder="Enter your password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e)}
                    errorMessage={errPassword}
                  />
                </div>
              </div>
              <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                <button className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">
                  Register
                </button>
                <Link to={"/auth/signin"}>
                  <button className="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">
                    Sign in
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GlobalLayout >
  );
};

export default SignUp;
