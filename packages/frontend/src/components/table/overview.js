export function Overview() {
    const items = [
		{ value: 'GK', label: 'Goal Keeper' },
		{ value: 'CB', label: 'Center Back' },
		{ value: 'LF', label: 'Left Back' },
		{ value: 'RB', label: 'Right Back' },
		{ value: 'RWF', label: 'Right Wing Forward' },
		{ value: 'LWF', label: 'Left Wing Forward' },
		{ value: 'CMF', label: 'Center Middle Forward' },
		{ value: 'DM', label: 'Defensive Midfielder' },
		{ value: 'CF', label: 'Center Forward' },
	].map(item => {
        return (<OverviewItem title={`(${item.value}) ${item.label}`}/>)
    });

    return (
        <div class="row gap-y-6 mt-5">
            <div class="intro-y col-12 col-lg-6">
                {items} 
             </div>
        </div>
    )
    
}

export function OverviewItem({title}) {
    return (
        <div class="intro-y mt-0">
            <div class="d-flex flex-column flex-sm-row align-items-center p-5 px-0 border-bottom border-gray-200 dark-border-dark-5">
                <h4 class="text-md font-medium mr-auto">
                    {title}
                </h4>
            </div>
            <div class="intro-y box p-5 mt-0">
                <div class="preview">
                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">#</th>
                                    <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">First Name</th>
                                    <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">Last Name</th>
                                    <th class="border-b-2 dark:border-dark-5 whitespace-nowrap">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-gray-200 dark:bg-dark-1">
                                    <td class="border-b dark:border-dark-5">1</td>
                                    <td class="border-b dark:border-dark-5">Angelina</td>
                                    <td class="border-b dark:border-dark-5">Jolie</td>
                                    <td class="border-b dark:border-dark-5">10</td>
                                </tr>
                                <tr>
                                    <td class="border-b dark:border-dark-5">2</td>
                                    <td class="border-b dark:border-dark-5">Brad</td>
                                    <td class="border-b dark:border-dark-5">Pitt</td>
                                    <td class="border-b dark:border-dark-5">9</td>
                                </tr>
                                <tr class="bg-gray-200 dark:bg-dark-1">
                                    <td class="border-b dark:border-dark-5">3</td>
                                    <td class="border-b dark:border-dark-5">Charlie</td>
                                    <td class="border-b dark:border-dark-5">Hunnam</td>
                                    <td class="border-b dark:border-dark-5">8</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="source-code hidden">
                    <button data-target="#copy-striped-rows-table" class="copy-code btn py-1 px-2 btn-outline-secondary"> <i data-feather="file" class="w-4 h-4 mr-2"></i> Copy example code </button>
                    <div class="overflow-y-auto mt-3 rounded-md">
                        <pre class="source-preview" id="copy-striped-rows-table"> <code class="text-xs p-0 rounded-md html pl-5 pt-8 pb-4 -mb-10 -mt-10"> HTMLOpenTagdiv class=&quot;overflow-x-auto&quot;HTMLCloseTag HTMLOpenTagtable class=&quot;table&quot;HTMLCloseTag HTMLOpenTagtheadHTMLCloseTag HTMLOpenTagtrHTMLCloseTag HTMLOpenTagth class=&quot;border-b-2 dark:border-dark-5 whitespace-nowrap&quot;HTMLCloseTag#HTMLOpenTag/thHTMLCloseTag HTMLOpenTagth class=&quot;border-b-2 dark:border-dark-5 whitespace-nowrap&quot;HTMLCloseTagFirst NameHTMLOpenTag/thHTMLCloseTag HTMLOpenTagth class=&quot;border-b-2 dark:border-dark-5 whitespace-nowrap&quot;HTMLCloseTagLast NameHTMLOpenTag/thHTMLCloseTag HTMLOpenTagth class=&quot;border-b-2 dark:border-dark-5 whitespace-nowrap&quot;HTMLCloseTagUsernameHTMLOpenTag/thHTMLCloseTag HTMLOpenTag/trHTMLCloseTag HTMLOpenTag/theadHTMLCloseTag HTMLOpenTagtbodyHTMLCloseTag HTMLOpenTagtr class=&quot;bg-gray-200 dark:bg-dark-1&quot;HTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTag1HTMLOpenTag/tdHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTagAngelinaHTMLOpenTag/tdHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTagJolieHTMLOpenTag/tdHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTag@angelinajolieHTMLOpenTag/tdHTMLCloseTag HTMLOpenTag/trHTMLCloseTag HTMLOpenTagtrHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTag2HTMLOpenTag/tdHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTagBradHTMLOpenTag/tdHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTagPittHTMLOpenTag/tdHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTag@bradpittHTMLOpenTag/tdHTMLCloseTag HTMLOpenTag/trHTMLCloseTag HTMLOpenTagtr class=&quot;bg-gray-200 dark:bg-dark-1&quot;HTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTag3HTMLOpenTag/tdHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTagCharlieHTMLOpenTag/tdHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTagHunnamHTMLOpenTag/tdHTMLCloseTag HTMLOpenTagtd class=&quot;border-b dark:border-dark-5&quot;HTMLCloseTag@charliehunnamHTMLOpenTag/tdHTMLCloseTag HTMLOpenTag/trHTMLCloseTag HTMLOpenTag/tbodyHTMLCloseTag HTMLOpenTag/tableHTMLCloseTag HTMLOpenTag/divHTMLCloseTag </code> </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}