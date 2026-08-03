import API from "../api/axios";


function CurrencySelector(){

const changeCurrency = async(e)=>{


await API.put(
"/user/currency",
{
currency:e.target.value
}
);


window.location.reload();

};



return(

<select
onChange={changeCurrency}
>

<option value="INR">
INR ₹
</option>

<option value="USD">
USD $
</option>

<option value="EUR">
EUR €
</option>

<option value="GBP">
GBP £
</option>


</select>

);

}


export default CurrencySelector;