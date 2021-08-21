// let itemno=0;
// document.querySelector('.add-btn').addEventListener('click',function(e) {
//   itemno++;
//   const name=document.getElementById('item-name');
//   const calories=document.getElementById('item-calories');
//   const list=document.getElementById('item-list');
//   list.innerHTML+=`
//   <li class="collection-item" id="item-0">
//         <strong>${name.value}: </strong><em>${calories.value} Calories</em>
//         <a href="#" class="secondary-content">
//           <i class="fas fa-pencil"></i>
//         </a>
//       </li>
//   `;
//   name.value=``;
//   calories.value=``;

//   e.preventDefault();
// });

const StorageCtrl=(function(){

  return{
    storeItem: function(item){
      let items;
      if(localStorage.getItem('items')===null){
        items=[];
        items.push(item);
        localStorage.setItem('items',JSON.stringify(items));
      }else{
        items=JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items',JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items')==null){
        items=[];
      }else{
        items=JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items=JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item,index){
        if(updatedItem.id===item.id){
          items.splice(index,1,updatedItem);     // replace
        }
      });
      localStorage.setItem('items',JSON.stringify(items));
    },
    deleteItemFromStorage:function(id){
      let items=JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item,index){
        if(id===item.id){
          items.splice(index,1);
        }
      });
      localStorage.setItem('items',JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();



const ItemCtrl=(function(){
  class Item {
    constructor(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
  }

  const data={
    items: StorageCtrl.getItemsFromStorage(),
    currentItem:null,
    totalCalories:0
  }

  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name,calories){
      let ID;
      if(data.items.length>0){
        ID=data.items[data.items.length-1].id+1;
      }else{
        ID=0;
      }

      calories=parseInt(calories);

      newItem=new Item(ID,name,calories);

      data.items.push(newItem);
      return newItem;
    },
    getTotalCalories: function(){
      let total=0;
      data.items.forEach(function(item){
        total+=item.calories;
      });
      data.totalCalories=total;

      return data.totalCalories;
    },
    getItemById: function(id){
      let found=null;
      data.items.forEach(function(item){
        if(item.id===id){
          found=item;
        }
      });
      return found;
    },
    updateItem:function(name,calories){
      calories=parseInt(calories);
      let found=null;
      data.items.forEach(function(item){
        if(item.id===data.currentItem.id){
          item.name=name;
          item.calories=calories;
          found=item;
        }
      });
      return found;
    },
    deleteItem:function(id){
      const ids=data.items.map(function(item){
        return item.id;
      });

      const index=ids.indexOf(id);

      data.items.splice(index,1);
    },
    clearAllItems: function(){
      data.items=[];
    },
    setCurrentItem: function(item){
      data.currentItem=item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },

    logData: function(){
      return data;
    }
  }

})();



const UICtrl=(function(){
  
  UISelectors = {
    itemList: '#item-list',
    addBtn:'.add-btn',
    updateBtn:'.update-btn',
    deleteBtn:'.delete-btn',
    clearBtn:'.clear-btn',
    backBtn:'.back-btn',
    itemNameInput:'#item-name',
    itemCaloriesInput:'#item-calories',
    totalCalories:'.total-calories',
    listItems: '#item-list li'
  }

  return {
    populateItemList: function(items){
      // document.querySelector(UISelectors.itemList).style.display='block';
      let html='';

      items.forEach(function(item){
        html+=`<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="fas fa-pencil edit-item"></i>
        </a>
      </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML=html;
    },
    getItemInput: function(){
      return{
      name:document.querySelector(UISelectors.itemNameInput).value,
      calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      document.querySelector(UISelectors.itemList).style.display='block';
      const li=document.createElement('li');
      li.className='collection-item';
      li.id=`item-${item.id}`;
      li.innerHTML=`<strong>${item.name}: </strong><em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="fas fa-pencil edit-item"></i>
      </a>`;

      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
    },
    updateListItem: function(item){
      let listItems=document.querySelectorAll(UISelectors.listItems);
      // console.log(listItems);

      // turn node list into array
      listItems=Array.from(listItems);
      listItems.forEach(function(listItem){
        const itemID=listItem.getAttribute('id');
        if(itemID===`item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML=`<strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="fas fa-pencil edit-item"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemID=`#item-${id}`;
      const item=document.querySelector(itemID);
      item.remove();
      
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value='';
      document.querySelector(UISelectors.itemCaloriesInput).value='';
    },
    addItemToForm:function(){
      document.querySelector(UISelectors.itemNameInput).value=ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value=ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems=document.querySelectorAll(UISelectors.listItems);
      // convert node list to array
      listItems=Array.from(listItems);
      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display='none';
    },
    showTotalCalories: function(total){
      document.querySelector(UISelectors.totalCalories).innerHTML=`${total}`;
    },
    clearEditState:function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display='none';
      document.querySelector(UISelectors.deleteBtn).style.display='none';
      document.querySelector(UISelectors.backBtn).style.display='none';
      document.querySelector(UISelectors.addBtn).style.display='inline';

    },
    showEditState:function(){
      document.querySelector(UISelectors.updateBtn).style.display='inline';
      document.querySelector(UISelectors.deleteBtn).style.display='inline';
      document.querySelector(UISelectors.backBtn).style.display='inline';
      document.querySelector(UISelectors.addBtn).style.display='none';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();




const App=(function(ItemCtrl,StorageCtrl,UICtrl){

  const loadEventListeners=function(){
    const UISelectors=UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

    document.addEventListener('keypress',function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        return false;
      }
    });

    //edit
    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
    
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

    document.querySelector(UISelectors.backBtn).addEventListener('click',itemUpdateSubmit);
    document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
  }

  const itemAddSubmit= function(e){
    const input=UICtrl.getItemInput();
    
    if(input.name!=='' && input.calories!==''){
      const it=ItemCtrl.addItem(input.name, input.calories);

      UICtrl.addListItem(it);

      //Total Calories
      const totalCalories=ItemCtrl.getTotalCalories();

      //add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      //store in local storage
      StorageCtrl.storeItem(it);

      //clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }

  const itemEditClick=function(e){
    if(e.target.classList.contains('edit-item')){
      const listId=e.target.parentNode.parentNode.id;
      
      const listIdArr=listId.split('-');

      const id=parseInt(listIdArr[1]);

      const itemToEdit=ItemCtrl.getItemById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }

  const itemUpdateSubmit=function(e){
    const input=UICtrl.getItemInput();
    const updatedItem=ItemCtrl.updateItem(input.name,input.calories);
    // console.log(updatedItem);
    UICtrl.updateListItem(updatedItem);

    const totalCalories=ItemCtrl.getTotalCalories();

      //add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      StorageCtrl.updateItemStorage(updatedItem);

      UICtrl.clearEditState();
    e.preventDefault();
  }

  const itemDeleteSubmit=function(e){
    const currentItem=ItemCtrl.getCurrentItem();
    // delete from data structure
    ItemCtrl.deleteItem(currentItem.id);
    // delete from ui
    UICtrl.deleteListItem(currentItem.id);
    UICtrl.clearEditState();
    //Total Calories
    const totalCalories=ItemCtrl.getTotalCalories();

    //add total calories to ui
    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.deleteItemFromStorage(currentItem.id);


    e.preventDefault();
  }

  const clearAllItemsClick=function(){
    // delete all items from ds
    ItemCtrl.clearAllItems();
    //Total Calories
    const totalCalories=ItemCtrl.getTotalCalories();

    //add total calories to ui
    UICtrl.showTotalCalories(totalCalories);
    // delete all items fro ui
    UICtrl.removeItems();
    StorageCtrl.clearItemsFromStorage();
    UICtrl.hideList();
  }

  return {
    init : function(){
      UICtrl.clearEditState();
      const items=ItemCtrl.getItems();

      // check if 0 items
      if(items.length===0){
        UICtrl.hideList();
      }else{
        UICtrl.populateItemList(items);
      }

      //Total Calories
      const totalCalories=ItemCtrl.getTotalCalories();

      //add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      

      loadEventListeners();
    }
  }
  
})(ItemCtrl,StorageCtrl,UICtrl);


// only return is public if we use iffy

App.init();