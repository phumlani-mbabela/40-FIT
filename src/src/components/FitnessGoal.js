import React from 'react';
import {Link} from 'react-router-dom';
import {Tab, Nav} from 'react-bootstrap';
import { IMAGES } from '../constants/theme';

const FitnessGoal = ({isOpenModal}) => {
    return (
        <>
            <div className="col-lg-6 about-content m-b30">
                <div className="section-head m-0">
                    <span className="sub-title">ABOUT US</span>
                    <h2 className="title">We Help To Get <span>Fitness</span> Goal</h2>
                    <p className="m-0">We’re a online, client-focused gym dedicated to helping you reach your goals starting with sustainable weight loss.</p>
                </div>
                <div className="" data-wow-delay="0.8s">
                    <Tab.Container defaultActiveKey={'Mission'}>
                        <Nav as="ul" className="nav nav-tabs style-1 m-b20 m-t30">
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link" eventKey={'Mission'}>
                                    <span>Our Mission</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link" eventKey={'Vision'}>
                                    <span>Our Vision</span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className="tab-content m-sm-b30 m-b40 p-r30" id="myTabContent">
                            <Tab.Pane eventKey={'Mission'}>
                                <div className="content">
                                    <p>We are an independent gym that is committed to working with you to gain the results you want. Whether your aim is to loose weight, tone up, build bulk or gain weight we can put together a gym programme or recommend.</p>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey={'Vision'}>
                                <div className="content">
                                    <p>Empower millions to build durable health anytime, anywhere by delivering science-based training, simple nutrition, and behavior design that fits real life. We’ll turn living rooms into high-performance micro-gyms, phones into trusted coaches, and daily choices into compounding, lifelong wellbeing.</p>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
                <div className="contact-us">
                    <span className="icon"><i className="fa-solid fa-phone"></i></span>
                    <div className="content">
                        <span>Call us for help</span>
                        <h4 className="number">+27847770098</h4>
                    </div>
                </div>
            </div>
            <div className="col-lg-6 m-b30">
                <div className="dz-media">
                    <div className="image-box">
                        <div className="video-bx1 h-auto w-auto overflow-visible">
                            <img src={IMAGES.boxpic1} alt="" />
                            <div className="video-btn sm">
                                <Link to={"#"} className="popup-youtube" 
                                    onClick={()=> isOpenModal(true)} >
                                    <i className="fa fa-play"/>
                                </Link> 
                            </div>
                        </div>
                        <div className="info-box">
                            <span><i className="flaticon-play text-primary"></i> High Quality Video</span>							
                        </div>
                    </div>
                    <div className="image-box">
                        <img src={IMAGES.boxpic2} alt="" />
                        <div className="info-box">
                            <span><i className="flaticon-athletics text-primary"></i> Online Trainer</span>
                        </div>
                    </div>
                </div>
            </div>
                    
        </>
    );
};

export default FitnessGoal;

