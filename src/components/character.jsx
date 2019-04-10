import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';



import '../css/style.css';
import '../css/character.css';

class Character extends Component {
  constructor(props) {
    super(props)
    this.plySelect = this.plySelect.bind(this)
  }

  componentDidMount() { window.addEventListener('DOMContentLoaded', this.props.setPlyType(this.props.plyNum)) }
  componentWillUnmount() { window.removeEventListener('DOMContentLoaded', this.props.setPlyType(this.props.plyNum)) }

  // 選擇鈕
  plySelect(e, plyListItem) {

    // 一個在選的時候，其他選擇鈕要封起來
    let selectBtns = document.querySelectorAll('.selectBtn');
    let elect = e.target.parentNode;
    selectBtns.forEach(sb => {
      if(sb.getAttribute('data-uid') !== elect.getAttribute('data-uid')) {
        sb.setAttribute('disabled', true);
      }
    })

    let whoAmI = elect.querySelector('p');
    let whoAmIs = document.querySelectorAll('.elect > p');
    let decideBtn = elect.querySelector('.decideBtn');
    let kickOutBtn = elect.querySelector('.kickOutBtn');
    
    // 如果角色已經被別人選走就不能再重複選
    let candidate = document.querySelectorAll('.candidate');
    candidate.forEach(cd => {
      if (cd.className === 'candidate charaSelected') {
      cd.setAttribute('disabled', true) }
    });

    // 我現在是誰文字用
    let selecting = function(e) {
      whoAmI.textContent = e.target.textContent;
    }
    // 角色選項變色用
    let toggling = function(e) {
      let option = candidate[0];
        while(option) {
            if(option.tagName === 'BUTTON') { option.classList.remove('charaActive') }
            option = option.nextSibling;
        }
        e.target.classList.add('charaActive');
    }
    // 決定用
    let deciding = function() {
      candidate.forEach( cd => {
        cd.removeEventListener('click', selecting);
        cd.removeEventListener('click', toggling);
        if (cd.classList.contains('charaActive')) {
          cd.className = ('candidate charaSelected') }
      });
      preventReClickSelectBtn();
      checkPlySelect();
    }

    // 反悔用
    let regrating = function(e) {
      candidate.forEach(cd => {
        if (cd.classList.contains('charaSelected') && cd.textContent === whoAmI.textContent) {
          cd.removeAttribute('disabled');
          cd.classList.remove('charaSelected');
        }
      });
      e.target.parentNode.querySelector('p').textContent = '';
      preventReClickSelectBtn();
      checkPlySelect();
    }
    
    // 選好要按叉叉再按選擇才可以重選，不可以直接按第二次選擇用
    let preventReClickSelectBtn = function() {
      whoAmIs.forEach(wai => {
        if(wai.textContent === '') {
          wai.parentNode.querySelector('.selectBtn').removeAttribute('disabled');
        } else { 
          wai.parentNode.querySelector('.selectBtn').setAttribute('disabled', true);
        }
      })
    }

    // 檢查都選好沒
    let checkPlySelect = function() {
      let plyNameArr = [];
      whoAmIs.forEach(wai => { plyNameArr.push(wai.textContent) });
      let checkPlyNameArr = plyNameArr.filter(pn => { return pn !== '' });
      if (checkPlyNameArr.length < 4) {
        document.querySelector('#gameStartLink').classList.add('disableGameStart');
      } else {
        document.querySelector('#gameStartLink').classList.remove('disableGameStart');
      }
    } 

    // charaOption 可以被選 + 被按會變色
    candidate.forEach( cd => {
      cd.addEventListener('click', selecting);
      cd.addEventListener('click', toggling);
    })

    // 決定鈕
    decideBtn.addEventListener('click', deciding);

    // 叉叉鈕
    kickOutBtn.addEventListener('click', regrating);
  }

  finalDecision () {
    let plyNameArr = [];
    // 把 .elect > p 裡面的文字抽出，推入上方 plyNameArr
    let electPArr = document.querySelectorAll('.elect > p');
    electPArr.forEach(ep => { plyNameArr.push(ep.textContent) });
    // 回傳給 characterReducer
    this.props.setPlyName(plyNameArr);
  }

  render() {
    const {
      plyList, character
    } = this.props;
    console.log('傳到這個 Component 裡的 props', this.props);
    return(
      <div id="character">
        <p>請選擇角色吧 !</p>
        <div id='charaDecide'>
        { plyList.map((d, i) => {
          return (
            <div key={i} data-uid={d.uid} className='elect'>
              { d.type }
              <p></p>
              <button data-uid={d.uid} className='selectBtn' onClick={(e) => { this.plySelect(e, plyList[i]) }}>選擇</button>
              <button className='decideBtn'>決定</button>              
              <button className='kickOutBtn'>&times;</button>
            </div>
        )})}
        </div>
        <div id='charaOption'>
        { character.map((c, i) => {
          return (
            <button key={i} className='candidate'>
              {c.name}
            </button>
        )})}
        </div>
        <NavLink id={'gameStartLink'} className={'disableGameStart'} onClick={() => this.finalDecision()} to='/game'>Game Start</NavLink>
      </div>
    )
  }
}

export default Character;