import React, { useEffect, useState, createRef } from "react";
import feather from "feather-icons";
import Tabulator from "tabulator-tables";
import xlsx from "xlsx";
import { getOperationName } from "@apollo/client/utilities";
import cash from "cash-dom";
import { getToken } from '@helpers/auth'
import store from "@store/store"
import { logout } from '@store/auth/action';
import { useTranslation, withTranslation } from 'react-i18next';

function getGqlString(doc) {
    return doc.loc && doc.loc.source.body;
}

const setup = (
    {
        query,
        columns: _columns,
        option,
        action = false,
        callback = (item) => { console.log(item) },
        searchFieldName = []
    }, filtering, searchQuery, t) => {

    const AuthToken = getToken();


    let current_page = null;
    let paginationSize = null;
    let auth = (AuthToken) ? {
        'Authorization': AuthToken ? `Bearer ${AuthToken}` : null
    } : {};

    const settings = {
        paginationSize: 50,
        paginationSizeSelector: [50, 100, 500],
    }

    const options = { ...settings, ...option }

    let columns = _columns
    if (Array.isArray(action)) {
        columns = columns.filter(item => item.field != "actions");
        columns.push({
            title: t("ACTIONS"),
            width: 100,
            field: "actions",
            responsive: 1,
            hozAlign: "right",
            vertAlign: "right",
            print: false,
            download: false,
            headerSort: false,
            formatter(cell, formatterParams) {
                let a = cash(`<div class="flex lg:justify-center items-center">
                            <a class="edit flex items-center mr-3" href="javascript:;">
                                <i data-feather="check-square" class="w-4 h-4 mr-1"></i> ${t(action[1])}
                            </a>
                        </div>`);
                cash(a)
                    .find(".edit")
                    .on("click", function () {
                        callback({
                            action: 'edit',
                            row: cell.getData()
                        })
                    });

                cash(a)
                    .find(".delete")
                    .on("click", function () {
                        callback({
                            action: 'delete',
                            row: cell.getData()
                        })
                    });

                return a[0];
            },
        })
    } else {
        columns = columns.filter(item => item.field != "actions");
        columns.push({
            title: t("ACTIONS"),
            width: 160,
            field: "actions",
            responsive: 1,
            hozAlign: "right",
            vertAlign: "right",
            print: false,
            download: false,
            headerSort: false,
            formatter(cell, formatterParams) {
                let a = cash(`<div class="flex lg:justify-center items-center">
                            <a class="edit flex items-center mr-3" href="javascript:;">
                                <i data-feather="check-square" class="w-4 h-4 mr-1"></i>  ${t('Edit')}
                            </a>
                            <a class="delete flex items-center text-theme-6" href="javascript:;">
                                <i data-feather="trash-2" class="w-4 h-4 mr-1"></i> ${t('Delete')}
                            </a>
                        </div>`);
                cash(a)
                    .find(".edit")
                    .on("click", function () {
                        callback({
                            action: 'edit',
                            row: cell.getData()
                        })
                    });

                cash(a)
                    .find(".delete")
                    .on("click", function () {
                        callback({
                            action: 'delete',
                            row: cell.getData()
                        })
                    });

                return a[0];
            },
        })
    }

    if(!action) {
        columns = columns.filter(col => col.field != "actions");
    }

    let number = 1;

    const autoNumber = () => {
        return number++;
    }
    
    columns = columns.map(({ ...col }) => {
        col.title = t(col.title);
        if (col.field === "ID") {
            col.mutator = autoNumber
        }
        return col;
    })

    let tbl = new Tabulator("#tabulator", {
        ...options,
        ajaxURL: process.env['REACT_APP_GRAPQL_URL'],
        mode: "cors", // no-cors, cors, *same-origin
        credentials: "omit", // include, *same-origin, omit
        ajaxFiltering: true,
        ajaxSorting: true,
        ajaxConfig: "POST",
        ajaxError: function ({status}) {
            if(status === 401) store.dispatch(logout())
        },
        ajaxContentType: {
            headers: {
                'Content-type': 'application/json',
                "Access-Control-Allow-Origin": "*", //the URL origin of the site making the request
                ...auth
            },
            body: function (url, config, params) {

                current_page = params.page;
                const { page = 0, size = 50, sorters } = params;
                const offset = (page - 1 > 0) ? page - 1 : 0;
                // TODO: conditions searching
                paginationSize = size

                // dir: "asc" field: "id"
                let orders = options?.orderBy ? options.orderBy : `ID_ASC`;

                if (sorters.length > 0) {
                    let orderBy = `${sorters[0].field.toUpperCase()}_${sorters[0].dir.toUpperCase()}`
                    orders = orderBy
                }

                // let filters = { name: { equalTo: "BCA" } };
                let variables = {
                    first: size,
                    offset: (current_page - 1) * size,
                    orderBy: orders
                }

                 
                if(options?.condition) variables.condition = options.condition;

                const fieldQuery = []
                for (let index = 0; index < searchFieldName.length; index++) {
                    fieldQuery.push({
                        [searchFieldName[index]]: {
                            "includesInsensitive": searchQuery ? searchQuery.value : "",
                        },
                    })
                }

                if (fieldQuery.length > 0) {
                    variables['filter'] = { "or": fieldQuery }
                }

                return JSON.stringify({
                    query: getGqlString(query),
                    variables: variables
                })
            },
        },
        ajaxResponse: function (url, params, response) {
            number = 1;
            const operationName = getOperationName(query);
            const { data } = response;
            const graphqlData = data;
            const resp = graphqlData[`${operationName}`];

            const { nodes, totalCount = null, pageInfo = { startCursor: null, endCursor: null } } = resp;

            filtering = pageInfo;
            let count = totalCount == null ? nodes.length : totalCount

            const res = {
                current_page: current_page,
                data: nodes,
                last_page: Math.ceil(count / paginationSize),
                total: count
            }
            return res;
        },
        pagination: "remote",
        columns: columns,
        paginationSize:50,
        layout: "fitColumns",
        responsiveLayout: "collapse",
        placeholder: "No matching records found",
        printAsHtml: true,
        printStyled: true,
        renderComplete() {
            feather.replace({
                "stroke-width": 1.5,
            });
        },
        locale: true,
        langs:{
            "id-id":{
                
                "pagination":{
                    "first":"Awal", //text for the first page button
                    "first_title":"Halaman awal", //tooltip text for the first page button
                    "last":"Akhir",
                    "last_title":"Halaman akhir",
                    "prev":"Sebelumnya",
                    "prev_title":"Halaman Sebelum",
                    "next":"Selanjutnya",
                    "next_title": "Halaman Lanjut",
                    "page_size": "Jumlah per halaman"
                },
                "headerFilters":{
                    "default":"filter column...", //default header filter placeholder text
                }
            }
        },
    });

    tbl.setLocale("id-id"); 
    tbl.getLocale(); 
    tbl.setPageSize(50);
    return {
        table: tbl,
        filtering
    };
}

const Table = (props) => {
    const { filename = 'filename.xlsx', sheetName = 'Table' } = props
    const ref = createRef(null);
    const [table, setTable] = useState(0);
    const [searchFields, setSearchFields] = useState({ value: "" })
    const [searchQuery, setSearchQuery] = useState({ value: "" })
    const [filtering, setFiltering] = useState(1);
    const { t } = useTranslation();

    useEffect(() => {
        let tbl = setup(props, filtering, searchQuery, t);
        setTable(tbl.table);

    }, [props, filtering, searchQuery]);

    const printMe = () => {
        table.print();
    }

    const exportXLS = () => {
        window.XLSX = xlsx;
        table.download("xlsx", `${filename}`, {
            sheetName
        });
    }

    const searching = (e) => {
        // table.setFilter(searchFields.field, searchFields.type, searchFields.value); not working
        e.preventDefault();
        setSearchQuery(searchFields);
    }

    const reset = () => {
        setSearchFields("")
        setSearchQuery("")
    }

    return (
        <div className="intro-y box p-5 mt-5">
            <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
                <form id="tabulator-html-filter-form" className="xl:flex sm:mr-auto"
                    onSubmit={searching}
                    onReset={reset}
                >
                    <div className="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
                        <label className="w-12 flex-none xl:w-auto xl:flex-initial mr-2">{t('Search')}</label>
                        <input defaultValue={''} onChange={(e) => setSearchFields((prev) => ({ ...prev, value: e.target.value }))} id="tabulator-html-filter-value" type="text" className="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0" placeholder={t("Search...")} />
                    </div>
                    <div className="mt-2 xl:mt-0">
                        <button id="tabulator-html-filter-go" type="submit" className="btn btn-primary w-full sm:w-16" >{t('Cari')}</button>
                        <button id="tabulator-html-filter-reset" type="reset" className="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1">{t('Reset')}</button>
                    </div>
                </form>
                <div className="flex mt-5 sm:mt-0" style={{display: 'block'}}>
                    <button onClick={printMe} id="tabulator-print" className="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"> <i data-feather="printer" className="w-4 h-4 mr-2"></i> Print </button>
                    <button onClick={exportXLS} id="tabulator-export-csv" className="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"> <i data-feather="file-text" className="w-4 h-4 mr-2"></i> Export CSV </button>
                </div>
            </div>
            <div className="overflow-x-auto scrollbar-hidden">
                <div ref={ref} id="tabulator" className="mt-5"></div>
            </div>
        </div>
    )
}
export default withTranslation()(Table);;