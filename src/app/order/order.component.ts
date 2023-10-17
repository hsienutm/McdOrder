import { Component } from '@angular/core';
import { Order } from '../Order-model';
import { Bot } from '../Bot-model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  constructor(){}
  pendingOrders: Order[] = [];
  processingOrders: Order[] = [];
  completedOrders: Order[] = [];
  bot:Bot[] = [];
  vipOrder: Order[] = [];
  normalOrder: Order[] = [];
  orderNumber: number= 1;
  botId: number = 1;

  ngOnInit(){
    this.startProcessing();
  }

  startProcessing():void{
    const processingInterval = setInterval(() => {
      this.checkBotAvailable();
    }, 1000);
  }

  createOrder(orderType: string){
    const status = orderType;
    const newOrder: Order={
      id: this.orderNumber,
      type: orderType,
      status: "Pending"
    };
    this.orderNumber++;
    if(orderType==="VIP"){
      this.vipOrder.push(newOrder);
    }else{
      this.normalOrder.push(newOrder);
    }
    this.pendingOrders = this.vipOrder.concat(this.normalOrder);
  }

  createBot(): void{
    const bot: Bot={
      id: this.botId,
      processing: false
    };
    this.botId++;
    this.bot.push(bot);
    this.checkBotAvailable();
  }

  checkBotAvailable(): void{
    for (const bot of this.bot) {
      if (!bot.processing && this.pendingOrders.length > 0) {
        const selectedOrder = this.pendingOrders[0];
        selectedOrder.status = "Processing";
        this.processingOrders.push(selectedOrder);
        this.pendingOrders.shift();
        selectedOrder.type==="VIP"? this.vipOrder.shift(): this.normalOrder.shift();
        this.processOrder(bot, selectedOrder);
      }
    }
  }

  destroyBot(): any{
    if(this.bot.length == 0){
      console.log("No bot to destroy");
      return;
    }
    const firstBot = this.bot.shift();
      if(firstBot && firstBot.processing){
        firstBot.processing = false;
        const destroyedOrder =  this.processingOrders.shift();
        if (destroyedOrder) {
          destroyedOrder.status="Pending";
          if(destroyedOrder.type==="VIP"){
            this.vipOrder.push(destroyedOrder);
          }else{
            this.normalOrder.push(destroyedOrder);
          }
          this.pendingOrders = this.vipOrder.concat(this.normalOrder);
        }
      }
  }

  processOrder(bot: Bot, order: Order):void{
    if(bot.processing){
      console.log("Bot is processing another order");
      return;
    }
    bot.processing = true;
    setTimeout(()=>{
      if(bot.processing){
        order.status = "Complete";
        bot.processing=false;
        this.processingOrders.shift();
        this.completedOrders.push(order);
      }else{
        console.log("Bot stopped process order");
      }
    }, 10000);
  }
}
