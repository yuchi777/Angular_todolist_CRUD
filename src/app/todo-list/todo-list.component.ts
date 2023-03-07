import { Component, OnInit } from '@angular/core';
import { TodoListService } from './todo-list.service';

// Class
import { Todo } from './todo.model';

import { TodoStatusType } from './todo-status-type';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  constructor(private todoListService: TodoListService) { }

  ngOnInit(): void {
  }

  /**
   * 新增代辦事項
   *
   * @param {HTMLInputElement} inputRef - 輸入框的元素實體
   * @memberof TodoListComponent
   */
  addTodo(event: KeyboardEvent): void {

    const todoThing = event.target as HTMLInputElement;
    if (!todoThing) {
      return; //如果為null時
    }
    if (event.key === 'Enter') {
      const todo = todoThing.value.trim();
      console.log(todo);

      this.todoListService.add(todo);
      todoThing.value = '';
    }

  }


  /**
   * 取得待辦事項清單
   *
   * @returns {Todo[]}
   * @memberof TodoListComponent
   */
  getList(): Todo[] {
    // return this.todoListService.getList();

    let list: Todo[] = [];
    switch (this.status) {

      case TodoStatusType.Active:
        list = this.getRemainingList();
        break;

      case TodoStatusType.Completed:
        list = this.getCompletedList();
        break;

      default:
        list = this.todoListService.getList();
        break;

    }

    return list;
  }


  /**
 * 移除待辦事項
 *
 * @param {number} index - 待辦事項的索引位置
 * @memberof TodoListComponent
 */
  remove(index: number): void {
    this.todoListService.remove(index);
  }


  /**
 * 開始編輯待辦事項
 *
 * @param {Todo} todo
 * @memberof TodoListComponent
 */
  edit(todo: Todo): void {
    todo.editable = true;
  }


  /**
 * 更新待辦事項
 *
 * @param {Todo} todo - 原本的待辦事項
 * @param {string} newTitle - 新的事項名稱
 * @memberof TodoListComponent
 */
  update(todo: Todo, newTitle: string): void {

    if (!todo.editable) {
      return;
    }

    const title = newTitle.trim();

    // 如果有輸入名稱則修改事項名稱
    if (title) {
      todo.setTitle(title);
      todo.editable = false;
    } else {

      // 如果沒有名稱則刪除該項待辦事項
      //indexOf() 方法會回傳給定元素於陣列中第一個被找到之索引，若不存在於陣列中則回傳 -1。
      const index = this.getList().indexOf(todo);
      if (index !== -1) {
        this.remove(index);
      }
    }
  }


  /**
 * 取消編輯狀態
 *
 * @param {Todo} todo - 欲取消編輯狀態的待辦事項
 * @memberof TodoListComponent
 */
  cancelEditing(todo: Todo): void {
    todo.editable = false;
  }


  /**
 * 取得未完成的待辦事項清單
 *
 * @returns {Todo[]}
 * @memberof TodoListComponent
 */
  getRemainingList(): Todo[] {
    return this.todoListService.getWithCompleted(false);
  }


  /**
* 待辦事項狀態的列舉
*
* @memberof TodoListComponent
*/
  todoStatusType = TodoStatusType;

  /**
   * 目前狀態
   *
   * @private
   * @memberof TodoListComponent
   */
  private status = TodoStatusType.All;


  /**
 * 取得已完成的待辦事項
 *
 * @returns {Todo[]}
 * @memberof TodoListComponent
 */
  getCompletedList(): Todo[] {
    return this.todoListService.getWithCompleted(true);
  }

  /**
   * 設定狀態
   *
   * @param {number} status - 欲設定的狀態
   * @memberof TodoListComponent
   */
  setStatus(status: number): void {
    this.status = status;
  }

  /**
   * 檢查目前狀態
   *
   * @param {number} status - 欲檢查的狀態
   * @returns {boolean}
   * @memberof TodoListComponent
   */
  checkStatus(status: number): boolean {
    return this.status === status;
  }


  /**
 * 從清單中移除所有已完成之待辦事項
 *
 * @memberof TodoListComponent
 */
  removeCompleted(): void {
    this.todoListService.removeCompleted();
  }







  

  /**
 * 取得所有的待辦事項清單（不受狀態影響）
 *
 * @returns {Todo[]}
 * @memberof TodoListComponent
 */
  getAllList(): Todo[] {
    return this.todoListService.getList();
  }

  /**
   * 所有的代辦事項是否都已完成
   *
   * @returns {boolean}
   * @memberof TodoListComponent
   */
  allCompleted(): boolean {
    return this.getAllList().length === this.getCompletedList().length;
  }

  /**
   * 設定所有的待辦事項已完成/未完成
   *
   * @param {boolean} completed - 已完成/未完成
   * @memberof TodoListComponent
   */
  setAllTo(completed: boolean): void {

    this.getAllList().forEach((todo) => {
      todo.setCompleted(completed);
    });

  }


}


// inputRef 指的是我們在 Template 使用 $event.target 取到的當前觸發事件的這個元素實體。
// HTMLInputElement 是 inputRef 的資料類型。我習慣會替參數宣告資料類型，也建議大家這麼做。因為 VSCode 會幫你檢查你傳入的參數型別有沒有問題 （如果是從 Template 傳入的倒是檢查不到），而且也會提示你這個參數有什麼屬性跟方法可以使用，可以節省時間且降低因打錯字造成 Bug 風險的，非常貼心！

// void 是指這個函式回傳值的資料類型，意思是沒有任何回傳值。
// String.prototype.trim()回傳一個新的字串，其為把 str 起始及結尾處的空白字元移除後的值。

