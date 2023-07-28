import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"


const History = () => {


    return <>
        <Content Page_title="TableWithIconButtons">
            <div class="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <div id="example_wrapper" className="dataTables_wrapper">
                            <div className="dataTables_length" id="example_length">
                                <label>
                                    Show{" "}
                                    <select name="example_length" aria-controls="example" className="">
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>{" "}
                                    entries
                                </label>
                            </div>
                            <div id="example_filter" className="dataTables_filter">
                                <label>
                                    Search:
                                    <input
                                        type="search"
                                        className=""
                                        placeholder=""
                                        aria-controls="example"
                                    />
                                </label>
                            </div>
                            <table
                                id="example"
                                className="display dataTable"
                                style={{ minWidth: 845 }}
                                role="grid"
                                aria-describedby="example_info"
                            >
                                <thead>
                                    <tr role="row">
                                        <th
                                            className="sorting_asc"
                                            tabIndex={0}
                                            aria-controls="example"
                                            rowSpan={1}
                                            colSpan={1}
                                            aria-sort="ascending"
                                            aria-label="Name: activate to sort column descending"
                                            style={{ width: "153.984px" }}
                                        >
                                            Name
                                        </th>
                                        <th
                                            className="sorting"
                                            tabIndex={0}
                                            aria-controls="example"
                                            rowSpan={1}
                                            colSpan={1}
                                            aria-label="Position: activate to sort column ascending"
                                            style={{ width: "229.594px" }}
                                        >
                                            Position
                                        </th>
                                        <th
                                            className="sorting"
                                            tabIndex={0}
                                            aria-controls="example"
                                            rowSpan={1}
                                            colSpan={1}
                                            aria-label="Office: activate to sort column ascending"
                                            style={{ width: "120.219px" }}
                                        >
                                            Office
                                        </th>
                                        <th
                                            className="sorting"
                                            tabIndex={0}
                                            aria-controls="example"
                                            rowSpan={1}
                                            colSpan={1}
                                            aria-label="Age: activate to sort column ascending"
                                            style={{ width: "55.25px" }}
                                        >
                                            Age
                                        </th>
                                        <th
                                            className="sorting"
                                            tabIndex={0}
                                            aria-controls="example"
                                            rowSpan={1}
                                            colSpan={1}
                                            aria-label="Start date: activate to sort column ascending"
                                            style={{ width: "101.203px" }}
                                        >
                                            Start date
                                        </th>
                                        <th
                                            className="sorting"
                                            tabIndex={0}
                                            aria-controls="example"
                                            rowSpan={1}
                                            colSpan={1}
                                            aria-label="Salary: activate to sort column ascending"
                                            style={{ width: "82.75px" }}
                                        >
                                            Salary
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="selected odd" role="row">
                                        <td className="sorting_1">Ashton Cox</td>
                                        <td>Junior Technical Author</td>
                                        <td>San Francisco</td>
                                        <td>66</td>
                                        <td>2009/01/12</td>
                                        <td>$86,000</td>
                                    </tr>
                                    <tr className="selected even" role="row">
                                        <td className="sorting_1">Bruno Nash</td>
                                        <td>Software Engineer</td>
                                        <td>London</td>
                                        <td>38</td>
                                        <td>2011/05/03</td>
                                        <td>$163,500</td>
                                    </tr>
                                    <tr className="selected odd" role="row">
                                        <td className="sorting_1">Cara Stevens</td>
                                        <td>Sales Assistant</td>
                                        <td>New York</td>
                                        <td>46</td>
                                        <td>2011/12/06</td>
                                        <td>$145,600</td>
                                    </tr>
                                    <tr className="selected even" role="row">
                                        <td className="sorting_1">Cedric Kelly</td>
                                        <td>Senior Javascript Developer</td>
                                        <td>Edinburgh</td>
                                        <td>22</td>
                                        <td>2012/03/29</td>
                                        <td>$433,060</td>
                                    </tr>
                                    <tr className="selected odd" role="row">
                                        <td className="sorting_1">Donna Snider</td>
                                        <td>Customer Support</td>
                                        <td>New York</td>
                                        <td>27</td>
                                        <td>2011/01/25</td>
                                        <td>$112,000</td>
                                    </tr>
                                    <tr className="selected even" role="row">
                                        <td className="sorting_1">Finn Camacho</td>
                                        <td>Support Engineer</td>
                                        <td>San Francisco</td>
                                        <td>47</td>
                                        <td>2009/07/07</td>
                                        <td>$87,500</td>
                                    </tr>
                                    <tr className="selected odd" role="row">
                                        <td className="sorting_1">Garrett Winters</td>
                                        <td>Accountant</td>
                                        <td>Tokyo</td>
                                        <td>63</td>
                                        <td>2011/07/25</td>
                                        <td>$170,750</td>
                                    </tr>
                                    <tr className="selected even" role="row">
                                        <td className="sorting_1">Gloria Little</td>
                                        <td>Systems Administrator</td>
                                        <td>New York</td>
                                        <td>59</td>
                                        <td>2009/04/10</td>
                                        <td>$237,500</td>
                                    </tr>
                                    <tr className="selected odd" role="row">
                                        <td className="sorting_1">Hermione Butler</td>
                                        <td>Regional Director</td>
                                        <td>London</td>
                                        <td>47</td>
                                        <td>2011/03/21</td>
                                        <td>$356,250</td>
                                    </tr>
                                    <tr className="selected even" role="row">
                                        <td className="sorting_1">Jackson Bradshaw</td>
                                        <td>Director</td>
                                        <td>New York</td>
                                        <td>65</td>
                                        <td>2008/09/26</td>
                                        <td>$645,750</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th rowSpan={1} colSpan={1}>
                                            Name
                                        </th>
                                        <th rowSpan={1} colSpan={1}>
                                            Position
                                        </th>
                                        <th rowSpan={1} colSpan={1}>
                                            Office
                                        </th>
                                        <th rowSpan={1} colSpan={1}>
                                            Age
                                        </th>
                                        <th rowSpan={1} colSpan={1}>
                                            Start date
                                        </th>
                                        <th rowSpan={1} colSpan={1}>
                                            Salary
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <div
                                className="dataTables_info"
                                id="example_info"
                                role="status"
                                aria-live="polite"
                            >
                                Showing 1 to 10 of 27 entries
                            </div>
                            <div
                                className="dataTables_paginate paging_simple_numbers"
                                id="example_paginate"
                            >
                                <a
                                    className="paginate_button previous disabled"
                                    aria-controls="example"
                                    data-dt-idx={0}
                                    tabIndex={0}
                                    id="example_previous"
                                >
                                    <i className="fa fa-angle-double-left" aria-hidden="true" />
                                </a>
                                <span>
                                    <a
                                        className="paginate_button current"
                                        aria-controls="example"
                                        data-dt-idx={1}
                                        tabIndex={0}
                                    >
                                        1
                                    </a>
                                    <a
                                        className="paginate_button "
                                        aria-controls="example"
                                        data-dt-idx={2}
                                        tabIndex={0}
                                    >
                                        2
                                    </a>
                                    <a
                                        className="paginate_button "
                                        aria-controls="example"
                                        data-dt-idx={3}
                                        tabIndex={0}
                                    >
                                        3
                                    </a>
                                </span>
                                <a
                                    className="paginate_button next"
                                    aria-controls="example"
                                    data-dt-idx={4}
                                    tabIndex={0}
                                    id="example_next"
                                >
                                    <i className="fa fa-angle-double-right" aria-hidden="true" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Content>
    </>
}


export default History

