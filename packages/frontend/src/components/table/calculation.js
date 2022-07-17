import React, { useEffect, useState } from 'react';
import classNames from "classnames";
import { positions } from '@helpers/position';
export function TableItem({params, key: uniq}) {
    const { normalise_data, items, allCategories, title, sub_category_headers, allCriteria, sub_criteria_kodes, sort_normalize, headers } = params;
    const [open, setOpen] = useState(false);
    const Collapsible = (props) => {
        const { open, children } = props
        return (
            <div className={classNames("collapsible",
                open ? "show" : "hide",
              )}
            >
            {children}
            </div>
        )
    }

    const handleToggle = () => setOpen((open) => !open)

    return (
        <div className="box m-3">
            <div className="row gap-y-6 mt-5 pt-2">
                <div className="col-12 col-lg-6">
                    <div className="flex flex-col sm:flex-row items-center p-5 border-b border-gray-200">
                        <h1 className="font-medium text-base mr-auto">
                            Score for <span className='font-extrabold'>{positions.find(pos => pos.value === title).label} ({title})</span>
                        </h1>
                        {(sort_normalize.length > 0) ? (
                            <div className="w-full sm:w-auto flex items-center sm:ml-auto mt-3 sm:mt-0">
                                <button onClick={handleToggle}
                                    open={false}
                                    aria-controls="basic-collapsible" type="button" className="btn btn-outline-secondary w-full d-inline-block me-1 mb-2">
                                    {(open) ? 'Close detail' : 'Open detail'} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`feather ${(open) ? 'feather-chevron-up': 'feather-chevron-down'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                            </div>
                        ) : (null)}
                        
                    </div>
                </div>

                <div className="col-12 col-lg-6" style={{display: ''}}>
                    <div className="p-5">
                        <table className="table">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-dark-1">
                                    <td className="border border-b-2 dark:border-dark-5 whitespace-nowrap">Kode</td>
                                    <td className="border border-b-2 dark:border-dark-5 whitespace-nowrap">Criteria</td>
                                </tr>
                            </thead>
                            <tbody>  
                                {sub_category_headers.map(value => {
                                    return (
                                        <tr key={ value.id} className="bg-gray-200 dark:bg-dark-1">
                                            <td className="border border-b-2 dark:border-dark-5 whitespace-nowrap">{ value.kode.toUpperCase() }</td>
                                            <td className="border border-b-2 dark:border-dark-5 whitespace-nowrap">{ value.name }</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <Collapsible
                    key={uniq}
                    open={open}
                    transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                    expandOnPrint
                >
                <div className="col-12 col-lg-6">
                    <div className="p-5">
                        <table className="table">
                            <thead>
                                <tr>
                                    {headers.map(value => {
                                        return (
                                            <th key={ value.id} className="border border-b-2 dark:border-dark-5 whitespace-nowrap">{value.label}</th>
                                        )
                                    })}

                                    {sub_category_headers.map(sub => {
                                        let core = (sub.type === 'CORE') ? 'font-extrabold' : '';
                                        return (
                                            <th key={ sub.id} className={`border border-b-2 dark:border-dark-5 whitespace-nowrap`}><span className={`${core}`}>{ sub.kode.toUpperCase()}</span></th>
                                        )
                                    })}
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(values => {
                                    return (
                                        <tr className="bg-white">
                                            {
                                                headers.map(value => {
                                                    return (
                                                        <td key={ value.id} className="border border-b-2  whitespace-nowrap">{values[`${value.value}`]}</td>
                                                    )
                                                })   
                                            }

                                            {
                                                sub_category_headers.map(sub => {
                                                    let val = 0;
                                                    for (const key in values.values) {
                                                        if (sub.id === Number(key)) {
                                                            val = values.values[key];
                                                        }
                                                    }

                                                    return (
                                                        <td  key={ sub.id} className="border border-b-2  whitespace-nowrap">{ val }</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })}

                                <tr className="bg-gray-200 dark:bg-dark-1">
                                    <td colSpan={2} className="border border-b-2 dark:border-dark-5 whitespace-nowrap"><span className='font-extrabold'>{'Target'}</span></td>
                                    {
                                        allCriteria.map(criteria => {
                                            return (
                                                <td  key={ criteria.id} className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>{ criteria.idealValue }</span></td>
                                            )
                                        })
                                    }
                                </tr>

                                {normalise_data.map(item => {
                                    return (
                                        <tr className="bg-white">
                                           <td className="border border-b-2  whitespace-nowrap">{ item.id }</td>
                                           <td className="border border-b-2  whitespace-nowrap">{ item.name }</td>
                                            {
                                                sub_category_headers.map(sub => {
                                                    return (
                                                        <td  key={ sub.id} className="border border-b-2  whitespace-nowrap">{ item[`gap_${sub.id}`] }</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })}

                                <tr className="bg-gray-200 dark:bg-dark-1">
                                    <td align="center" colSpan={sub_category_headers.length + 2} className="border border-b-2 dark:border-dark-5 whitespace-nowrap"><span className='font-extrabold'>{'Integrity conversion'}</span></td>
                                </tr>

                                {normalise_data.map(item => {
                                    return (
                                        <tr  key={ item.id} className="bg-white">
                                           <td className="border border-b-2  whitespace-nowrap">{ item.id }</td>
                                           <td className="border border-b-2  whitespace-nowrap">{ item.name }</td>
                                            {
                                                sub_category_headers.map(sub => {
                                                    return (
                                                        <td  key={ sub.id} className="border border-b-2  whitespace-nowrap">{ item[`integrity_${sub.id}`] }</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })}

                            </tbody>

                        </table>
                    </div>
                </div>
                  
                {allCategories.map((category, index) => {
                    return (
                        <div className="col-12 col-lg-6">
                            <div className="p-5">
                                <h1 className='font-extrabold'>Table { category.title} ({category.percentage}%)</h1>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            {headers.map(value => {
                                                return (
                                                    <th key={ value.id} className="border border-b-2 dark:border-dark-5 whitespace-nowrap">{value.label}</th>
                                                )
                                            })}

                                            {category.subCriteria.nodes.map(subCriteria => {
                                                let core = (subCriteria.type === 'CORE') ? 'font-extrabold' : '';
                                                return (
                                                    <th key={ subCriteria.id} className="border border-b-2 dark:border-dark-5 whitespace-nowrap"><span className={`${core} uppercase`}>{sub_criteria_kodes[subCriteria.id]}</span></th>
                                                )
                                            })}
                                            <td className="border border-b-2  whitespace-nowrap">{ 'NCF '}</td>
                                            <td className="border border-b-2  whitespace-nowrap">{ 'NSF' }</td>
                                            <td className="border border-b-2  whitespace-nowrap">{ `N(${index+1})` }</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {normalise_data.map(item => {
                                        return (
                                            <tr className="bg-white">
                                                <td className="border border-b-2  whitespace-nowrap">{ item.id }</td>
                                                <td className="border border-b-2  whitespace-nowrap">{ item.name }</td>
                                                {
                                                    category.subCriteria.nodes.map(sub => {
                                                        return (
                                                            <td  key={ sub.id} className="border border-b-2  whitespace-nowrap">{ item[`integrity_${sub.id}`] }</td>
                                                        )
                                                    })
                                                }
                                                <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>{ item[`ncf_${category.id}`] }</span></td>
                                                <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>{item[`nsf_${category.id}`]}</span></td>
                                                <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>{ item[`nTotal_${category.id}`]}</span></td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })}
                </Collapsible>
                <div className="col-12 col-lg-6">
                    <div className="p-5">
                        <h1 className='font-extrabold'>Table Rangking</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>No.</span></td>
                                    <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>Name</span></td>
                                    {allCategories.map((category, index) => {
                                        return (
                                            <td  key={ category.id} className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'> { category.title} </span></td>
                                        )
                                        
                                    })}

                                    <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>Point</span></td>
                                </tr>
                            </thead>
                            <tbody>
                                {(sort_normalize.length > 0) ? (
                                    sort_normalize.map((item, index) => {
                                        let bold = 'bg-white';
                                        if(index === 0) bold = 'bg-theme-12'
                                        return (
                                            <tr className={`${bold}`}>
                                                <td className="border border-b-2  whitespace-nowrap">{ item.id }</td>
                                                <td className="border border-b-2  whitespace-nowrap">{item.name}</td>
                                                {allCategories.map((category) => {
                                                    return (
                                                        <td  key={ category.id} className="border border-b-2  whitespace-nowrap"><span className='font-normal'>{ item[`nTotal_${category.id}`]}</span></td>
                                                    )
                                                })}
                                                <td className="border border-b-2  whitespace-nowrap"><span className='font-normal'>{ item.total_point}</span></td>
                                            </tr>
                                        )
                                    })
                                ): (
                                    <tr>
                                        <td colSpan={ allCategories.length + 3}  className="border border-b-2  whitespace-nowrap">No Data</td>
                                    </tr>
                                )}
                            </tbody> 
                        </table>
                    </div>
                </div>
                
            </div>
        </div>
    )

}