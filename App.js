import React ,{ useState, useEffect } from 'react';
import M from 'materialize-css';
import {getWebsiteInfo, getArticle,getRecentArticles, getAbout} from './api.js';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  NavLink,
  Redirect,
  useRouteMatch
} from "react-router-dom";
import {withRouter} from 'react-router';

import {
    Row,
    Col,
    Card,
    Icon
  } from 'react-materialize';

import ReactMarkdown from 'react-markdown';
import removeMD from 'remove-markdown';
import anime from "animejs";


const URL_ONE = 'https://api-core.ryanapfel.com';

class App extends React.Component {
  constructor() {
      super();
      this.state = {
      name: 'Jane Doe',
      position: 'Web Developer',
      welcome_blob: '',
      url: 'http://localhost:1337',
      }
  }



render() {

  return (
    <div className="App">
      <BrowserRouter>
      <Switch>
        <Route exact={true} path='/' component={Home}></Route>
        <Route exact={true} path='/about' component={About}></Route>
        <Route  path='/article/:name' component={Article}></Route>
        <Route component={NotFound}></Route>
      </Switch>
      </BrowserRouter>
    </div>
  );
}

}

function NotFound()
{
  return(<Redirect to='/'></Redirect>);
}

function animate()
{
  var basicTimeline = anime.timeline();
  basicTimeline
    .add({
      targets: '.left',
      translateX: [-300,0],
      duration: 700,
      easing: "easeOutSine"
    })
    .add({
      targets: '.top',
      translateY: [40,0],
      opacity:[0,1],
      duration: 500,
      easing: "easeOutSine",
      delay: anime.stagger(100)
    });
}

function Home()
{
    useEffect(() => {animate();});
  return(<Row>
    <SideBar></SideBar>

    <Col offset='s3' s={9} className='default-padding'>
    <Descrption></Descrption>
    <ArticleList articles={4} title={'My Work'}></ArticleList>
    </Col>

  </Row>
);
}

function About(){

  const [result, setData] = useState({title:'', image:{url:'',name:''}, id:'', categories:[] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // You can await her
      setLoaded(false);
      const result = await getAbout(URL_ONE);
      setData(result);
      setLoaded(true);
    }
    fetchData();
    animate();
  }, []);


  return(
    <Row>
      <SideBar/>

      <Col offset='s3' s={9} className='default-padding Article'>
        <h1 className='top'>{result.title}</h1>
        <img className='top banner-image' src={URL_ONE + result.image.url} alt={result.image.name}/>
        <ReactMarkdown className='article-content top' source={result.content} />
      </Col>


      </Row>

);
}

class Article extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {error: false,
                  loaded: false,
                  posts:{name:'', content:'', image:{url:'',name:''}},
                  sections:[]

                };
  }

  componentDidMount = async () => {
    this.setState({loaded:false});
    const name = this.props.match.params.name;
    const posts = await getArticle(URL_ONE, name);
    if(posts.statusCode === 404){
      this.setState({error: true}) }
    else{
      this.setState({error: false, posts, loaded: true});
    }
    animate();
    this.getHeaders();

  }

  componentDidUpdate = async (previousProps) => {
    const name = this.props.match.params.name;
    if (previousProps.match.params.name !== name) {
      const posts = await getArticle(URL_ONE, name);
      if(posts.statusCode === 404){
        this.setState({error: true}) }
      else{
        this.setState({error: false, posts, loaded: true});
      }
      animate();
      this.getHeaders();
    }
  }

  getHeaders(){
    let sections = [...document.getElementsByTagName('h3')];
    this.setState({sections});
  }


  render() {
    if(this.state.error) {return(<Redirect to='/'></Redirect>)}
    return(
      <Row className='Article'>
      <Col className='left grey lighten-4 full-height fixed' s={3}>
      <div className='sideBar'>
        <NavLink className='grey-text hover-blue' to='/'><Icon style='top: 6px; position: relative;'>chevron_left</Icon>Home</NavLink>
        <ul className='names'>{this.state.loaded && this.state.sections.map(i => {
          return(<li className='link-item' key={i.innerText}><a  className='grey-text hover-blue' href='' onClick={(e) => {
            e.preventDefault();
            i.scrollIntoView();
          }}>{i.innerText}</a></li>
          );
        })}
        </ul>
      </div>
      </Col>
      <Col offset='s3' s={9} className='default-padding'>
        <h1 className='top'>{this.state.posts.title}</h1>
        <img className='top banner-image' src={URL_ONE + this.state.posts.image.url} alt={this.state.posts.image.name}/>
        <ReactMarkdown className='article-content top' source={this.state.posts.content} />
      </Col>
      </Row>

  );
  };

}



function Descrption()
{
  const [result, setData] = useState({ name:'', description:'' });



    useEffect(() => {
      async function fetchData() {
        // You can await here
        const result = await getWebsiteInfo(URL_ONE);
        setData(result);
      }
      fetchData();
    }, []); // Or [] if effect doesn't need props or state

    return(

        <div className='description horizontal-center'>
          <h4 className='top'>Hello, I'm {result.name}</h4>
          <p className='top'>{result.description}</p>

        </div>


    );
}


function SideBar()
{
  const [result, setData] = useState({ name:'', position:'', links:[], description:''  });


  useEffect(() => {
    async function fetchData() {
      // You can await here
      const result = await getWebsiteInfo(URL_ONE);
      setData(result);
    }
    fetchData();
  }, []); // Or [] if effect doesn't need props or state

  console.log(result.links);
  return(
    <Col className='grey lighten-4 full-height fixed left' s={3}>
    <div className='sideBar'>
      <div className='names'>
        <h2 className=''>{result.name}</h2>
        <h3 className='blue-text text-darken-3'>{result.position}</h3>
      </div>

      <div className='links'>
        <ul>
        <li className='link-item'><NavLink className='grey-text hover-blue' to='/' activeStyle={{color:'blue'}}>Home</NavLink></li>
        <li className='link-item'><NavLink className='grey-text hover-blue' to='/about' activeStyle={{color:'blue'}}>About</NavLink></li>
        </ul>
        <ul>
        {result.links.map((item, index) => {
          return(
            <li className='link-item grey-text' key={index}><a className='grey-text hover-blue' href={item.url}>{item.link_name}</a></li>
          );
        })}

        </ul>
      </div>

    </div>

    </Col>

  );
}


function ArticleList(props)
{
  const [result, setData] = useState([{title:'', image:{url:'',name:''}, id:'', categories:[] }]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // You can await her
      setLoaded(false);
      const result = await getRecentArticles(URL_ONE, props.articles);
      setData(result);
      setLoaded(true);
    }
    fetchData();
  }, [props.articles]);


  if(loaded){
    return(
      <div className='ArticleList'>
      <h4 className='top'>{props.title}</h4>
      <Row className='top'>
        {result.map((item, index)=>{
          let br = true;
          index % 2 == 0 ? br = false : br = true
          return (
            <>
            <Col className='top' l={6} s={12} key={index}>
            <ArticleItem item={item} index={index}/>
            </Col>
            {br && <Row></Row>}
            </>
          );
        })}
      </Row>
    </div>
    );
  } else {
    {
      return(<div className='ArticleList top'></div>);
    }
  }

}

function ArticleItem(props)
{


  return(
  <NavLink to={`article/${props.item.id}`}>
  <article>
  <Card className='z-depth-2 hoverable'>
    <div className='card-image'>
      <img src={URL_ONE + props.item.image.url}/>
    </div>
    <div className='text-content'>
      <h3 className='black-text'>{props.item.title}</h3>
      <p className='grey-text truncate'>{removeMD(props.item.content)}</p>
    </div>
    </Card>
  </article>
  </NavLink>
);
}



export default App;
