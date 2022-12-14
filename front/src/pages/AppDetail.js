import { Container, Row, Col } from "react-bootstrap";
import Footer from "../template/Footer";
import ApiHeader from "../template/ApiHeader";
import '../css/AppDetail.css'
import ScrollToTop from '../template/ScrollToTop';
import { useState, useEffect} from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import { instance } from '../template/AxiosConfig/AxiosInterceptor';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ApiDocumentForm() {
    const location = useLocation();     
    const app = location.search.substring(7);

    // useState
    const [appOne, setAppLOne] = useState({});
    const [email, setEmail] = useState('');
    const [updateShow, setUpdateShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [appName, setAppName] = useState('');
    const [deleteSentence, setDeleteSentence] = useState('');

    // useEffect
    useEffect(()=>{
        setEmail(localStorage.getItem('email'));
        selectAppDetail();
    },[location]); 

    // useNavigate
    const navigate = useNavigate();

    // function
    const goToMain = () => {
        navigate("/application");
    };
    const successNotify = (e) => toast.success(e,toast.defaultOption);
    const errorNotify = (e) => toast.error(e,toast.defaultOption);
    const appInfoName = (e) => {
        setAppName(e.target.value);
    };
    const deleteInfoSentence = (e) => {
        setDeleteSentence(e.target.value);
    };
    const handleUpdateShow = () => setUpdateShow(true);
    const handleUpdateClose = () => {
        setUpdateShow(false);
    }
    const handleDeleteShow = () => setDeleteShow(true);
    const handleDeleteClose = () => {
        setDeleteShow(false);
    }
    const selectAppDetail = () => {
        instance({
            method: "get",
            url: `/application/one/` + app,
        }).then(function (res) {
            setAppLOne(res.data);
        }).catch(function (err){ 
            // console.log(err);
        });
    };
    const reIssueAppKey = () => {
        instance({
            method: "put",
            url: `/application/key/`,
            data: {appId:appOne.id},
        }).then(function (res) {
            setAppLOne(res.data);
            successNotify("??? ?????? ????????? ???????????????.");
        }).catch(function (err){ 
            // console.log(err);
        });
    };
    const updateOnKeyPress = e => {
        if (e.key === 'Enter') {
            appUpdate(); // Enter ????????? ?????? ?????? ????????? ??????
        }
    };
    const appUpdate = () => {
        instance({
            method: "put",
            url: `/application/name`,
            data: {appId:appOne.id, currentName:appOne.name, newName:appName},
        }).then(function (res) {
            setAppLOne(res.data);
            successNotify('??? ????????? ?????? ???????????????.')
        }).catch(function (err){
            // console.log(err);
            if(err.response.data.code == "A001"){
                errorNotify("????????? ??? ????????? ???????????????.");
            } 
        });
        setUpdateShow(false);
    }
    const deleteOnKeyPress = e => {
        if (e.key === 'Enter') {
            appDelete(); // Enter ????????? ?????? ?????? ????????? ??????
        }
    };
    const appDelete = () => {
        if(appOne.name + ' ???????????????.' == deleteSentence){
            instance({
                method: "delete",
                url: `/application`,
                data: {appId:appOne.id},
            }).then(function (res) {
                successNotify('?????? ?????????????????????.')
                goToMain();
            }).catch(function (err){
                errorNotify('??? ????????? ??????????????????.')
                // console.log(err);
            });
        }else{
            errorNotify('?????? ????????? ?????? ?????? ??????????????????.');
        }
    }
    const doCopy = () => {
        // ?????? ??????????????? copy ????????? ??????????????? ??????
        if (!document.queryCommandSupported("copy")) {
            return errorNotify("??????????????? ???????????? ?????? ?????????????????????.");
        }
        // ?????????????????textarea??? ???????????? ????????? ????????? text??? ??????
        const textarea = document.createElement("textarea");
        textarea.value = appOne.apiKey;
        // ????????? ??????????????document.body?????appendChild
        document.body.appendChild(textarea);
        // focus() -> ????????? ???????????? ?????????
        textarea.focus();
        // select() -> ???????????? ????????? ????????? ????????? ????????? ??? ??????
        textarea.select();
        // exeCommand??? ???????????? ??????
        document.execCommand("copy");
        // ?????? ?????????????????body??? ???????????textarea??? ??????
        document.body.removeChild(textarea);
        successNotify("??? ?????? ?????? ???????????????.");
    };

    return (
        <>
            <ScrollToTop/>
            <Modal show={deleteShow} onHide={handleDeleteClose} className="modal_radius">
                <Modal.Header closeButton >
                    <div className="KDC_Dialog__header__1eFei">
                        <strong className="tit_layer modal-header-font">??? ????????????</strong>
                    </div>
                </Modal.Header>
                <Modal.Body>
                <Form >
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="lab_normal">?????? ???????????? ???????????? ????????? ????????? ??????????????????.</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={appOne.name + ' ???????????????.'} 
                            className="KDC_Input__root__3kmvC modal_radius"
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="lab_normal">?????? ?????? (????????? ?????? ????????????.)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="?????? ??????"
                            className="KDC_Input__root__3kmvC modal_radius"
                            onChange={deleteInfoSentence}
                            onKeyPress={deleteOnKeyPress}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose} className="modal_radius">
                        ??????
                    </Button>
                    <Button variant="primary" onClick={appDelete} className="modal_danger">
                        ??????
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={updateShow} onHide={handleUpdateClose} className="modal_radius">
                <Modal.Header closeButton >
                    <div className="KDC_Dialog__header__1eFei">
                        <strong className="tit_layer modal-header-font">??? ?????? ????????????</strong>
                    </div>
                </Modal.Header>
                <Modal.Body>
                <Form >
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="lab_normal">?????? ??? ??????</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={appOne.name}
                            className="KDC_Input__root__3kmvC modal_radius"
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="lab_normal">?????? ??? ??? ??????</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="?????? ??? ??? ??????"
                            className="KDC_Input__root__3kmvC modal_radius"
                            onChange={appInfoName}
                            onKeyPress={updateOnKeyPress}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUpdateClose} className="modal_radius">
                        ??????
                    </Button>
                    <Button variant="primary" onClick={appUpdate} className="modal_radius">
                        ??????
                    </Button>
                </Modal.Footer>
            </Modal>

            <Container fluid = 'sm' style={{ marginTop: '79px' }}>
                <Row>
                    <Col sm={2}/>
                    <Col sm={8}>
                        <div className="KDC_AppInfo__root__DWY2K area_appinfo">
                            <div className="box_thumb">
                                <img className="KDC_Image__root__2m4AU" src="https://k.kakaocdn.net/14/dn/btqvX1CL6kz/sSBw1mbWkyZTkk1Mpt9nw1/o.jpg" alt="app_icon" width="64" height="64"/>
                            </div>
                            <div className="box_typeinfo">
                                <strong>{appOne.name}
                                    <Link to='../application' type="button" className="KDC_IconButton__root__1ksa2 btn_dropdown Button_List">
                                        <span className="KDC_Icon__root__3ZxBV KDC_Icon__list__15KxQ mb-1"></span>
                                        <span className="screen_out">?????????????????? ??????</span>
                                    </Link>
                                </strong>
                                <div className="inbox_typeinfo">
                                    <span className="KDC_Badge__root__25Csl item_info">ID {appOne.id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="KDC_AppInfo__root__DWY2K">
                            <div className="KDC_Column__root__1Zx1r KDC_Column__flex_1__3WFYc">
                                <div className="KDC_Section__root__2FzZg">
                                    <div className="KDC_SectionTitle__root__3lMtt">
                                        <p className="link_viewcont" href="/console/app/777799/config/appKey">??? ???</p>
                                    </div>
                                    <ul>
                                        <li className="KDC_ListLayout__item__37RHl">
                                            <div className="tit_info">
                                                <label className="lab_normal">??? ???</label>
                                            </div>
                                            <div className="KDC_ListLayout__content__3-MiL">
                                                {appOne.apiKey}
                                                <button type="button" className="Button_Nomal" onClick={doCopy}>??????</button>
                                                <button type="button" className="Button_Nomal" onClick={reIssueAppKey}>?????????</button>
                                            </div>
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="KDC_AppInfo__root__DWY2K">
                            <div className="KDC_Column__root__1Zx1r KDC_Column__flex_1__3WFYc">
                                <div className="KDC_Section__root__2FzZg">
                                    <div className="KDC_SectionTitle__root__3lMtt">
                                        <p className="link_viewcont" href="/console/app/777799/config/appKey">??? ??????</p>
                                    </div>
                                    <ul>
                                        <li className="KDC_ListLayout__item__37RHl">
                                            <div className="tit_info">
                                                <label className="lab_normal">??? ID</label>
                                            </div>
                                            <div className="KDC_ListLayout__content__3-MiL">{appOne.id}</div>
                                        </li>
                                        <li className="KDC_ListLayout__item__37RHl">
                                            <div className="tit_info">
                                                <label className="lab_normal">??? ??????</label>
                                            </div>
                                            <div className="KDC_ListLayout__content__3-MiL">{appOne.name}</div>
                                        </li>
                                        <li className="KDC_ListLayout__item__37RHl">
                                            <div className="tit_info">
                                                <label className="lab_normal">?????? EMAIL</label>
                                            </div>
                                            <div className="KDC_ListLayout__content__3-MiL">{email}</div>
                                        </li>
                                    </ul>
                                    <button type="button" className="Button_Update" onClick={handleUpdateShow}>??? ?????? ??????</button>
                                    <button type="button" className="Button_Delete" onClick={handleDeleteShow}>??? ??????</button>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={2}/>
                </Row>
            </Container> 
        </>
    )
}

function ApiDocument() {
    return (
        <>
            <ApiHeader></ApiHeader>
            <ApiDocumentForm></ApiDocumentForm>
            <Footer></Footer>
        </>
    )
}

export default ApiDocument;
