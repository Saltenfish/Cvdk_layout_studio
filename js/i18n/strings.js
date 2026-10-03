'use strict';
/* 整段 HTML（元素 innerHTML 完全相同才換）*/
const I18N_HTML={
'角色介面能用的都在這裡，另外多了<b>聊天室限定</b>（折疊、表格、SVG）。圖片會自動改成背景圖。':[
 'Everything from the character page works here, plus <b>chat-only</b> parts (collapsibles, tables, SVG). Images are turned into background images automatically.',
 '캐릭터 소개에서 쓰는 건 모두 여기 있고, <b>채팅방 전용</b>(접기, 표, SVG)이 추가돼요. 이미지는 자동으로 배경 이미지로 바뀌어요.',
 'キャラ紹介で使えるものはすべてここにあり、さらに<b>チャット専用</b>（折りたたみ・表・SVG）があります。画像は自動で背景画像になります。'],
'小工具的基礎部件：變數用 <b>{{英文大寫}}</b>，改名字就能對應你的狀態值。完整的小工具在「模板」。':[
 'Basic widget parts: variables use <b>{{UPPERCASE}}</b> — rename them to match your status values. Complete widgets are under "Templates".',
 '위젯 기본 부품: 변수는 <b>{{영문대문자}}</b> 로 쓰고, 이름을 바꾸면 상태값과 연결돼요. 완성된 위젯은 「템플릿」에 있어요.',
 'ウィジェットの基本パーツ：変数は <b>{{英大文字}}</b>。名前を変えればステータス値に対応します。完成品は「テンプレ」にあります。'],
'<b style="color:var(--accent)">按住縮圖拖到預覽上</b>：拖到畫布＝圖層、拖到畫布外＝滿寬圖片。':[
 '<b style="color:var(--accent)">Drag a thumbnail onto the preview</b>: onto a canvas = layer, outside a canvas = full-width image.',
 '<b style="color:var(--accent)">썸네일을 미리보기로 드래그</b>: 캔버스 위 = 레이어, 캔버스 밖 = 전체 너비 이미지.',
 '<b style="color:var(--accent)">サムネをプレビューへドラッグ</b>：キャンバス上＝レイヤー、キャンバス外＝全幅画像。'],
'拖到「畫布區塊」上＝變成可自由移動的<b style="color:var(--accent)">圖層</b>；拖到一般區塊上＝接在它後面。':[
 'Drop onto a "canvas block" = a freely movable <b style="color:var(--accent)">layer</b>; drop onto a normal block = placed after it.',
 '「캔버스 블록」 위에 놓기 = 자유롭게 움직이는 <b style="color:var(--accent)">레이어</b>, 일반 블록 위 = 그 뒤에 붙음.',
 '「キャンバスブロック」に落とす＝自由に動かせる<b style="color:var(--accent)">レイヤー</b>、通常ブロックに落とす＝その後ろに追加。'],
'<b>小工具會刪掉 <code>url()</code></b>：用到 url() 的花紋（六角網、格線、雜訊）已經自動隱藏，下面列的都能用。':[
 '<b>Widgets remove <code>url()</code></b>: patterns that use url() (hex grid, grid lines, noise) are hidden; everything listed below works.',
 '<b>위젯은 <code>url()</code> 을 삭제해요</b>: url()을 쓰는 무늬(육각망, 격자, 노이즈)는 숨겼어요. 아래 목록은 모두 쓸 수 있어요.',
 '<b>ウィジェットは <code>url()</code> を削除します</b>：url() を使う柄（六角網・格子・ノイズ）は非表示にしてあり、下のものはすべて使えます。'],
'部件庫 <span style="font-weight:400;letter-spacing:0">（滑過看樣子・按住拖到預覽）</span>':[
 'Parts <span style="font-weight:400;letter-spacing:0">(hover to peek · drag onto the preview)</span>',
 '부품 <span style="font-weight:400;letter-spacing:0">(마우스를 올려 보기 · 미리보기로 드래그)</span>',
 'パーツ <span style="font-weight:400;letter-spacing:0">（ホバーで確認・プレビューへドラッグ）</span>'],
'把調好的樣式存起來，之後選一個元素、點一下就套用。含 <code>position:absolute</code> 的會當成「圖層」直接加到畫布。':[
 'Save a style you like, then select an element and click to apply it. Styles with <code>position:absolute</code> are added to the canvas as a "layer".',
 '꾸민 스타일을 저장해 두고, 요소를 선택해 클릭하면 적용돼요. <code>position:absolute</code> 가 있으면 「레이어」로 캔버스에 추가돼요.',
 '整えたスタイルを保存し、要素を選んでクリックで適用。<code>position:absolute</code> を含むものは「レイヤー」としてキャンバスに追加されます。'],
'新增元素 <span style="font-weight:400;letter-spacing:0">（點＝插入 · 拖＝放到指定位置）</span>':[
 'Add element <span style="font-weight:400;letter-spacing:0">(click = insert · drag = place)</span>',
 '요소 추가 <span style="font-weight:400;letter-spacing:0">(클릭 = 삽입 · 드래그 = 원하는 위치)</span>',
 '要素を追加 <span style="font-weight:400;letter-spacing:0">（クリック＝挿入・ドラッグ＝指定位置）</span>'],
'21 款完整的小工具。滑過看樣子，點開可以「插入」或「取代整份」。<br>變數都是 <b>{{英文大寫}}</b>，記得在角色設定的狀態值裡用同樣的名字。':[
 '21 complete widgets. Hover to peek; open one to "Insert" or "Replace all".<br>Variables are all <b>{{UPPERCASE}}</b> — use the same names in your character\'s status values.',
 '완성된 위젯 21종. 마우스를 올려 보고, 펼쳐서 「삽입」 또는 「전체 교체」할 수 있어요.<br>변수는 모두 <b>{{영문대문자}}</b> 이니 캐릭터 설정의 상태값에도 같은 이름을 쓰세요.',
 '完成済みウィジェット 21 種。ホバーで確認、開くと「挿入」か「全部置き換え」ができます。<br>変数はすべて <b>{{英大文字}}</b>。キャラ設定のステータス値でも同じ名前を使ってください。'],
'<b>小工具不能放圖片</b>：&lt;img&gt; 會被刪、style 裡的 <code>url()</code> 也會被刪。可以用漸層、色塊、文字符號代替。':[
 '<b>Widgets can\'t show images</b>: &lt;img&gt; is removed, and so is <code>url()</code> in styles. Use gradients, color blocks or text symbols instead.',
 '<b>위젯에는 이미지를 넣을 수 없어요</b>: &lt;img&gt; 와 style 안의 <code>url()</code> 이 삭제돼요. 그라데이션, 색 블록, 문자 기호로 대신하세요.',
 '<b>ウィジェットには画像を置けません</b>：&lt;img&gt; も style 内の <code>url()</code> も削除されます。グラデーション・色ブロック・記号で代用してください。'],
'<b>聊天室會刪掉 &lt;img&gt;</b>。這裡拖放／插入的圖片會自動改寫成「背景圖 div」（<code>background:url()</code>），在聊天室能正常顯示。':[
 '<b>Chat removes &lt;img&gt;</b>. Images you drop or insert here are rewritten as a "background-image div" (<code>background:url()</code>), which shows fine in chat.',
 '<b>채팅방은 &lt;img&gt; 를 삭제해요</b>. 여기서 드래그/삽입한 이미지는 「배경 이미지 div」(<code>background:url()</code>)로 자동 변환돼 채팅방에서 정상적으로 보여요.',
 '<b>チャットは &lt;img&gt; を削除します</b>。ここでドロップ／挿入した画像は「背景画像 div」（<code>background:url()</code>）に自動で書き換わり、チャットでも表示されます。'],
'<b>一般 div → 畫布</b><br>把一個區塊變成「畫布」：裡面第一層的東西會依照現在的位置變成可以自由拖曳的圖層（top／left／width 用 %），字級改成跟著寬度等比縮放。':[
 '<b>Normal div → canvas</b><br>Turns a block into a "canvas": its direct children become freely draggable layers at their current positions (top / left / width in %), and font sizes scale with the width.',
 '<b>일반 div → 캔버스</b><br>블록을 「캔버스」로 바꿔요: 바로 안쪽 요소들이 지금 위치 그대로 자유롭게 드래그할 수 있는 레이어가 되고(top/left/width는 %), 글자 크기는 너비에 맞춰 비례 조절돼요.',
 '<b>通常の div → キャンバス</b><br>ブロックを「キャンバス」にします：直下の要素が今の位置のまま自由に動かせるレイヤー（top／left／width は %）になり、文字サイズは幅に合わせて拡縮します。'],
'<b>畫布 → 一般 div</b><br>把畫布裡的圖層依照由上到下的位置排回一般版面，用 margin 保留原本的間距；同一列並排的會放進同一排。沒有文字的裝飾層（漸層、光暈）保留在原位。':[
 '<b>Canvas → normal div</b><br>Lays the canvas layers back out top to bottom as a normal layout, keeping the gaps with margin; items side by side go in the same row. Decorative layers without text (gradients, glows) stay in place.',
 '<b>캔버스 → 일반 div</b><br>캔버스의 레이어를 위에서 아래 순서로 일반 레이아웃으로 되돌리고, 간격은 margin으로 유지해요. 나란히 있던 것은 같은 줄에 넣어요. 글자 없는 장식 레이어(그라데이션, 빛)는 그대로 둬요.',
 '<b>キャンバス → 通常の div</b><br>キャンバスのレイヤーを上から順に通常のレイアウトへ戻し、間隔は margin で保ちます。横並びのものは同じ行に。文字のない装飾レイヤー（グラデーション・光）はそのまま残します。'],
'<b>基準寬度是什麼？</b><br>就是「你的設計在多寬的時候是你要的樣子」。轉換時會先把內容排在這個寬度量位置，再換算成百分比；字級也會設定成在這個寬度時剛好等於原本的 px，比它窄就等比縮小。例如你是用 780 寬設計的，就填 780。':[
 '<b>What is the base width?</b><br>It\'s "the width at which your design looks the way you want". The content is laid out at this width to measure positions, which are then converted to percentages; font sizes are set to equal the original px at this width and shrink proportionally when narrower. If you designed at 780 wide, enter 780.',
 '<b>기준 너비란?</b><br>「내 디자인이 원하는 모습으로 보이는 너비」예요. 변환할 때 이 너비로 배치해 위치를 잰 뒤 퍼센트로 바꾸고, 글자 크기도 이 너비에서 원래 px와 같도록 맞춰서 더 좁으면 비례해서 줄어들어요. 780 너비로 디자인했다면 780을 입력하세요.',
 '<b>基準幅とは？</b><br>「デザインが意図どおりに見える幅」のことです。変換時はこの幅で並べて位置を測り、パーセントに換算します。文字サイズもこの幅で元の px と同じになるよう設定し、狭いと比例して縮みます。780 幅でデザインしたなら 780 と入力してください。'],
'<b>單擊</b> 選取<br> <b>雙擊</b> 直接改字（反白可單獨調）<br> <b>拖外框</b> 移動畫布裡的圖層<br> <b>拖角落</b> 縮放・<b>上方圓點</b> 旋轉<br> <b>Delete</b> 刪除・<b>Ctrl+C</b> 複製區塊':[
 '<b>Click</b> to select<br> <b>Double-click</b> to edit text (highlight to style part of it)<br> <b>Drag the frame</b> to move a canvas layer<br> <b>Drag a corner</b> to resize · <b>top dot</b> to rotate<br> <b>Delete</b> removes · <b>Ctrl+C</b> copies the block',
 '<b>클릭</b> 선택<br> <b>더블클릭</b> 글자 바로 수정 (드래그로 일부만 꾸미기)<br> <b>테두리 드래그</b> 캔버스 레이어 이동<br> <b>모서리 드래그</b> 크기 조절・<b>위쪽 점</b> 회전<br> <b>Delete</b> 삭제・<b>Ctrl+C</b> 블록 복사',
 '<b>クリック</b>で選択<br> <b>ダブルクリック</b>で文字を直接編集（選択して部分調整）<br> <b>枠をドラッグ</b>でキャンバスのレイヤーを移動<br> <b>角をドラッグ</b>で拡縮・<b>上の丸</b>で回転<br> <b>Delete</b>で削除・<b>Ctrl+C</b>でブロックをコピー'],
'所有存檔、素材、色票、常用設定都存在<b>這台電腦、這個瀏覽器</b>的 localStorage。<br>・換電腦、換瀏覽器、無痕模式都看不到<br>・清除瀏覽器的網站資料會一起被刪掉<br>想保險的話，定期按「匯出備份」存一份檔案。':[
 'All saves, assets, swatches and saved styles live in the localStorage of <b>this computer and this browser</b>.<br>・They won\'t appear on another computer, another browser or in private mode<br>・Clearing the browser\'s site data deletes them too<br>To be safe, press "Export backup" now and then to keep a file.',
 '모든 저장, 소재, 색상, 즐겨찾기 스타일은 <b>이 컴퓨터, 이 브라우저</b>의 localStorage에 저장돼요.<br>・다른 컴퓨터, 다른 브라우저, 시크릿 모드에서는 안 보여요<br>・브라우저의 사이트 데이터를 지우면 함께 삭제돼요<br>안전하게 하려면 가끔 「백업 내보내기」로 파일을 저장해 두세요.',
 '保存・素材・色・マイスタイルはすべて<b>このパソコン・このブラウザ</b>の localStorage に保存されます。<br>・別のパソコン、別のブラウザ、シークレットモードでは見えません<br>・ブラウザのサイトデータを消すと一緒に消えます<br>念のため、ときどき「バックアップを書き出す」でファイルを保存してください。'],
'<b>已插入</b>到選取區塊之後':['<b>Inserted</b> after the selected block','선택한 블록 뒤에 <b>삽입</b>했어요','選択ブロックの後ろに<b>挿入</b>しました'],
'<b>已插入</b>到頁尾':['<b>Inserted</b> at the end','맨 끝에 <b>삽입</b>했어요','末尾に<b>挿入</b>しました'],
'<b>已插入</b>':['<b>Inserted</b>','<b>삽입</b>했어요','<b>挿入</b>しました'],
'<b>已儲存</b>':['<b>Saved</b>','<b>저장</b>했어요','<b>保存</b>しました'],
'<b>已刪除</b>':['<b>Deleted</b>','<b>삭제</b>했어요','<b>削除</b>しました'],
'<b>已復原</b>':['<b>Undone</b>','<b>실행 취소</b>했어요','<b>元に戻し</b>ました'],
'<b>已重做</b>':['<b>Redone</b>','<b>다시 실행</b>했어요','<b>やり直し</b>ました'],
'<b>圖片已更換</b>':['<b>Image replaced</b>','<b>이미지 교체됨</b>','<b>画像を差し替えました</b>'],
'<b>尺寸已更新</b>':['<b>Size updated</b>','<b>크기 업데이트됨</b>','<b>サイズを更新しました</b>'],
'<b>疊層已調整</b>':['<b>Stacking order changed</b>','<b>겹침 순서 변경됨</b>','<b>重なり順を変更しました</b>']
};

/* 動態字串：[正則, en, ko, ja]；{1}{2}… 是抓到的值（能翻的會一起翻）*/
const I18N_PAT=[
[/^圖片：(.+)$/,'Image: {1}','이미지: {1}','画像：{1}'],
[/^(.+?)：按住拖到預覽＝用這個樣式放圖（點一下＝設為預設樣式）$/,'{1}: drag onto the preview to place an image in this style (click = set as default)','{1}: 미리보기로 드래그 = 이 스타일로 배치 (클릭 = 기본값)','{1}：プレビューへドラッグ＝このスタイルで配置（クリック＝既定に）'],
[/^圖片 (.+)$/,'Image {1}','이미지 {1}','画像 {1}'],
[/^(\w+) · 圖層$/,'{1} · layer','{1} · 레이어','{1} · レイヤー'],
[/^(\w+) · 畫布$/,'{1} · canvas','{1} · 캔버스','{1} · キャンバス'],
[/^<b>(\d+) 張圖片還是示範圖<\/b>——點選圖片，在屬性最上面的「圖片網址」換成你自己的圖片$/,'<b>{1} image(s) are still samples</b> — click the image and replace the "Image URL" at the top of Props with your own','<b>이미지 {1}장이 아직 예시 이미지예요</b> — 이미지를 클릭하고 속성 맨 위 「이미지 URL」을 내 이미지로 바꾸세요','<b>{1} 枚の画像がまだサンプルです</b>——画像をクリックし、プロパティ上部の「画像URL」を自分の画像に差し替えてください'],
[/^⚙ <b>(.+?)<\/b> 的設定$/,'⚙ <b>{1}</b> settings','⚙ <b>{1}</b> 설정','⚙ <b>{1}</b> の設定'],
[/^(.+?) · 濾鏡$/,'{1} · Filter','{1} · 필터','{1} · フィルター'],
[/^這裡是「<b id="saveModeName">(.+?)<\/b>」自己的存檔，其他頁面看不到。上限 <b>(\d+)<\/b> 筆。<br><b>載入<\/b>＝整份取代，<b>插入<\/b>＝接到後面。$/,
 'These are the saves for "<b id="saveModeName">{1}</b>" only — other pages can\'t see them. Up to <b>{2}</b>.<br><b>Load</b> = replace all, <b>Insert</b> = append.',
 '「<b id="saveModeName">{1}</b>」 전용 저장 공간이에요. 다른 페이지에서는 안 보여요. 최대 <b>{2}</b>개.<br><b>불러오기</b> = 전체 교체, <b>삽입</b> = 뒤에 붙이기.',
 '「<b id="saveModeName">{1}</b>」専用の保存枠です。他のページからは見えません。最大 <b>{2}</b> 件。<br><b>読み込み</b>＝全部置き換え、<b>挿入</b>＝後ろに追加。'],
[/^<b>動畫<\/b> (.+)$/,'<b>Animation</b> {1}','<b>애니메이션</b> {1}','<b>アニメーション</b> {1}'],
[/^<b>已併入<\/b> (\d+) 項；保留 (\d+) 項既有設定$/,'<b>Merged</b> {1}; kept {2} existing','<b>병합</b> {1}개, 기존 설정 {2}개 유지','<b>統合</b> {1} 件、既存の {2} 件は保持'],
[/^<b>已併入<\/b> (\d+) 項$/,'<b>Merged</b> {1}','<b>병합</b> {1}개','<b>統合</b> {1} 件'],
[/^<b>已加入常用<\/b> (.+)$/,'<b>Added to saved</b> {1}','<b>즐겨찾기에 추가</b> {1}','<b>お気に入りに追加</b> {1}'],
[/^<b>已匯入 (\d+) 張圖片<\/b>到素材庫；想自由拖拉可選容器按「▣ 轉為畫布」$/,'<b>Imported {1} images</b> into assets; to drag freely, select a container and press "▣ Make canvas"','<b>이미지 {1}장</b>을 소재함에 가져왔어요. 자유롭게 옮기려면 컨테이너를 선택하고 「▣ 캔버스로 변환」','<b>画像 {1} 枚</b>を素材に取り込みました。自由に動かすならコンテナを選んで「▣ キャンバスにする」'],
[/^<b>已匯出<\/b> (\d+) 項資料$/,'<b>Exported</b> {1} items','<b>내보내기</b> {1}개 항목','<b>書き出し</b> {1} 件'],
[/^<b>已套用<\/b>「(.+?)」（保留 (\d+) 項原本的設定）$/,'<b>Applied</b> "{1}" (kept {2} existing settings)','「{1}」 <b>적용됨</b> (기존 설정 {2}개 유지)','「{1}」を<b>適用</b>（元の設定 {2} 件は保持）'],
[/^<b>已套用<\/b>「(.+?)」$/,'<b>Applied</b> "{1}"','「{1}」 <b>적용됨</b>','「{1}」を<b>適用</b>しました'],
[/^<b>已套用<\/b> (.+)$/,'<b>Applied</b> {1}','<b>적용됨</b> {1}','<b>適用</b> {1}'],
[/^<b>已存<\/b>「(.+?)」到我的常用設定$/,'<b>Saved</b> "{1}" to My saved styles','「{1}」을 내 즐겨찾기 스타일에 <b>저장</b>했어요','「{1}」をマイスタイルに<b>保存</b>しました'],
[/^<b>已存檔<\/b>（(\d+)\/(\d+)）$/,'<b>Saved</b> ({1}/{2})','<b>저장됨</b> ({1}/{2})','<b>保存しました</b>（{1}/{2}）'],
[/^<b>已換成<\/b>「(.+?)」$/,'<b>Switched to</b> "{1}"','「{1}」(으)로 <b>바꿨어요</b>','「{1}」に<b>変更</b>しました'],
[/^<b>已移除<\/b> (\d+) 個註解$/,'<b>Removed</b> {1} comments','주석 {1}개 <b>삭제</b>','コメント {1} 件を<b>削除</b>'],
[/^<b>已載入<\/b>「(.+?)」$/,'<b>Loaded</b> "{1}"','「{1}」 <b>불러옴</b>','「{1}」を<b>読み込み</b>ました'],
[/^<b>已轉為畫布<\/b>——裡面 (\d+) 個元素現在都能自由拖曳了$/,'<b>Converted to canvas</b> — its {1} elements can now be dragged freely','<b>캔버스로 변환</b> — 안의 요소 {1}개를 이제 자유롭게 드래그할 수 있어요','<b>キャンバスにしました</b>——中の {1} 個の要素を自由にドラッグできます'],
[/^<b>已釘選<\/b> (.+)$/,'<b>Pinned</b> {1}','<b>고정됨</b> {1}','<b>ピン留め</b> {1}'],
[/^<b>旋轉<\/b> (.+)$/,'<b>Rotate</b> {1}','<b>회전</b> {1}','<b>回転</b> {1}'],
[/^<b>位置<\/b> (.+)$/,'<b>Position</b> {1}','<b>위치</b> {1}','<b>位置</b> {1}'],
[/^<b>已清除<\/b> (\d+) 張（保留 (\d+) 張釘選）$/,'<b>Cleared</b> {1} (kept {2} pinned)','<b>지움</b> {1}장 (고정 {2}장 유지)','<b>クリア</b> {1} 枚（ピン留め {2} 枚は保持）'],
[/^<b>已複製<\/b>「(.+?)」$/,'<b>Copied</b> "{1}"','「{1}」 <b>복사됨</b>','「{1}」を<b>コピー</b>しました'],
[/^<b>已複製<\/b> (.+)$/,'<b>Copied</b> {1}','<b>복사됨</b> {1}','<b>コピー</b> {1}'],
[/^切到 <b>(.+?)<\/b>$/,'Switched to <b>{1}</b>','<b>{1}</b>(으)로 전환','<b>{1}</b>に切り替え'],
[/^寬度 <b>(\d+)px<\/b>$/,'Width <b>{1}px</b>','너비 <b>{1}px</b>','幅 <b>{1}px</b>'],
[/^已帶入目前「(.+?)」的 code$/,'Loaded the current "{1}" code','현재 「{1}」 코드를 가져왔어요','今の「{1}」のコードを取り込みました'],
[/^已把 <b>(\d+)px<\/b> 存進第 (\d+) 格$/,'Saved <b>{1}px</b> to slot {2}','<b>{1}px</b> 를 {2}번 칸에 저장했어요','<b>{1}px</b> を {2} 番目の枠に保存しました'],
[/^已把 (\d+) 個區塊變成圖層$/,'Turned {1} blocks into layers','블록 {1}개를 레이어로 바꿨어요','{1} 個のブロックをレイヤーにしました'],
[/^已把 (\d+) 個圖層排成固定版面（沒有文字的裝飾層保留原位）$/,'Laid out {1} layers as a normal layout (decorative layers without text stay in place)','레이어 {1}개를 일반 레이아웃으로 배치했어요 (글자 없는 장식 레이어는 그대로)','{1} 個のレイヤーを通常レイアウトに並べました（文字のない装飾レイヤーはそのまま）'],
[/^已換回「(.+?)」的範例（可按 ↩ 復原）$/,'Restored the "{1}" sample (press ↩ to undo)','「{1}」 예시로 되돌렸어요 (↩ 로 취소 가능)','「{1}」のサンプルに戻しました（↩ で元に戻せます）'],
[/^已清除(文字|背景|邊框)色$/,'Cleared {1} color','{1} 색을 지웠어요','{1}の色をクリアしました'],
[/^套用到(文字|背景|邊框)$/,'Apply to {1}','{1}에 적용','{1}に適用'],
[/^已清除第 (\d+) 格$/,'Cleared slot {1}','{1}번 칸을 비웠어요','{1} 番目の枠をクリアしました'],
[/^已達上限 (\d+) 筆，請先刪除舊的存檔$/,'Limit of {1} reached — delete an old save first','최대 {1}개에 도달했어요. 오래된 저장을 먼저 지우세요','上限 {1} 件です。古い保存を先に削除してください'],
[/^沒有可加入的屬性（(\d+) 項已經設定過，保留原本的）$/,'Nothing to add ({1} already set, kept as is)','추가할 속성이 없어요 ({1}개는 이미 설정돼 있어 그대로 둠)','追加できる属性がありません（{1} 件は設定済みのため保持）'],
[/^沒有可加入的屬性（(\d+) 項與現有重疊，全部保留）$/,'Nothing to add ({1} overlap with existing, all kept)','추가할 속성이 없어요 ({1}개가 기존과 겹쳐 모두 유지)','追加できる属性がありません（{1} 件が既存と重複、すべて保持）'],
[/^([\d,]+) 字元（([+\-][\d,]+)）$/,'{1} chars ({2})','{1}자 ({2})','{1} 文字（{2}）'],
[/^([\d,]+) 字元$/,'{1} chars','{1}자','{1} 文字'],
[/^已自動儲存 (\d+:\d+)$/,'Auto-saved {1}','자동 저장됨 {1}','自動保存 {1}'],
[/^([⚠ℹ]) (\d+) 項提醒（點我看詳情）$/,'{1} {2} notices (click for details)','{1} 알림 {2}개 (클릭해서 자세히)','{1} お知らせ {2} 件（クリックで詳細）'],
[/^已存 (\d+) \/ (\d+) 筆$/,'{1} / {2} saved','{1} / {2}개 저장됨','{1} / {2} 件保存済み'],
[/^套用：(.+)$/,'Apply: {1}','적용: {1}','適用：{1}'],
[/^(#?[0-9a-fA-F]{3,8}|rgba?\(.+\))（右鍵移除）$/,'{1} (right-click to remove)','{1} (우클릭으로 삭제)','{1}（右クリックで削除）'],
[/^套用 (\d+)px（右鍵＝清除這格）$/,'Use {1}px (right-click = clear slot)','{1}px 적용 (우클릭 = 칸 비우기)','{1}px を適用（右クリック＝枠をクリア）'],
[/^(.+)：按住拖到預覽＝用這個形式放圖（點一下＝設為預設形式）$/,'{1}: drag onto the preview = place an image in this style (click = make default)','{1}: 미리보기로 드래그 = 이 형식으로 이미지 배치 (클릭 = 기본 형식)','{1}：プレビューへドラッグ＝この形式で画像を配置（クリック＝既定に）'],
[/^(\d+) 種$/,'{1}','{1}종','{1} 種'],
[/^透明 (\d+)%$/,'Opacity {1}%','불투명도 {1}%','不透明度 {1}%'],
[/^圓角 (.+)$/,'Radius {1}','모서리 {1}','角丸 {1}'],
[/^CaveDuck (.+?)相容性檢查$/,'CaveDuck {1} compatibility check','CaveDuck {1} 호환성 검사','CaveDuck {1} 互換性チェック'],
[/^CaveDuck 排版室・(.+)$/,'CaveDuck Layout Studio · {1}','CaveDuck 레이아웃 스튜디오 · {1}','CaveDuck レイアウト工房・{1}'],
[/^目前的 HTML 完全符合 CaveDuck (.+?)規則，貼上即可用。$/,'This HTML fully follows the CaveDuck {1} rules — ready to paste.','지금 HTML은 CaveDuck {1} 규칙에 완전히 맞아요. 바로 붙여넣으면 돼요.','今の HTML は CaveDuck {1} のルールに完全に合っています。そのまま貼れます。'],
[/^<code>&lt;(\w+)&gt;<\/code> 在(.+?)<b>無效<\/b>（(\d+) 處，整段內容會消失）$/,'<code>&lt;{1}&gt;</code> is <b>not allowed</b> in {2} ({3}; the whole content disappears)','<code>&lt;{1}&gt;</code> 는 {2}에서 <b>무효</b> ({3}곳, 내용 전체가 사라짐)','<code>&lt;{1}&gt;</code> は{2}で<b>無効</b>（{3} か所、中身ごと消えます）'],
[/^<code>&lt;(\w+)&gt;<\/code> 在(.+?)<b>無效<\/b>（(\d+) 處，標籤被拆掉、內容保留）$/,'<code>&lt;{1}&gt;</code> is <b>not allowed</b> in {2} ({3}; the tag is stripped, content kept)','<code>&lt;{1}&gt;</code> 는 {2}에서 <b>무효</b> ({3}곳, 태그만 제거되고 내용은 유지)','<code>&lt;{1}&gt;</code> は{2}で<b>無効</b>（{3} か所、タグだけ外れて中身は残ります）'],
[/^屬性 <code>(.+?)<\/code> 不在白名單，會被移除（(\d+) 處）$/,'Attribute <code>{1}</code> isn\'t allowed and will be removed ({2})','속성 <code>{1}</code> 은 허용 목록에 없어서 삭제돼요 ({2}곳)','属性 <code>{1}</code> は許可リストにないため削除されます（{2} か所）'],
[/^偵測到 (\d+) 個<b>雙引號屬性<\/b>，按 code 列的「✒ 單引號化」一鍵轉換$/,'Found {1} <b>double-quoted attributes</b> — press "✒ Single quotes" in the code bar to convert','<b>큰따옴표 속성</b> {1}개 발견 — 코드 바의 「✒ 작은따옴표로」로 한 번에 변환','<b>ダブルクォートの属性</b>が {1} 個あります——コード欄の「✒ シングルクォート化」で一括変換'],
[/^(\d+) 個 <code>position:absolute<\/code> 元素沒有 <code>position:relative<\/code> 的父層，位置會亂跑——建議放進「畫布區塊」或幫父層加 relative$/,'{1} <code>position:absolute</code> elements have no <code>position:relative</code> parent, so they\'ll drift — put them in a "canvas block" or add relative to the parent','<code>position:absolute</code> 요소 {1}개에 <code>position:relative</code> 부모가 없어서 위치가 어긋나요 — 「캔버스 블록」에 넣거나 부모에 relative를 추가하세요','<code>position:absolute</code> の要素 {1} 個に <code>position:relative</code> の親がなく、位置がずれます——「キャンバスブロック」に入れるか親に relative を付けてください']
,[/^(.*)（還沒放圖）$/,'{1} (no image yet)','{1} (이미지 없음)','{1}（画像なし）']
,[/^(.+) × 比例$/,'{1} × ratio','{1} × 비율','{1} × 比率'],[/^(.+?) · (.+)$/,'{1} · {2}','{1} · {2}','{1} · {2}']
,[/^⚠ (.+)$/,'⚠ {1}','⚠ {1}','⚠ {1}']
,[/^<b>已壓縮<\/b> (\d+) 處連續空白行$/,'<b>Squeezed</b> {1} runs of blank lines','연속 빈 줄 {1}곳을 <b>압축</b>했어요','連続した空行 {1} か所を<b>詰め</b>ました']
];
