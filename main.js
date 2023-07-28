// 지도 옵션 설정
var mapOptions = {
    center: new naver.maps.LatLng(35.3, 127.7), // 지도의 중심 좌표
    zoom: 8, // 지도의 확대 레벨
    disableDoubleClickZoom: true, // 더블 클릭 시 확대 기능 비활성화
    pinchZoom: true, // 핀치 줌(다중 터치) 활성화
    draggable: true // 드래그 가능하게 설정
};

// 지도 생성
var map = new naver.maps.Map('map', mapOptions);

// 마커 정보를 가져오는 fetch 함수
fetch('markers.json')
    .then(response => response.json())
    .then(markers => {
        var currentInfoWindow = null;

        markers.forEach((markerInfo, i) => {
            var marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(markerInfo.lat, markerInfo.lng),
                map: map,
                icon: { // 빨간색 마커 이미지를 사용하도록 아이콘 설정
                    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // 빨간색 마커 이미지의 URL을 지정
                    size: new naver.maps.Size(30, 50),
                    origin: new naver.maps.Point(0, 0),
                    anchor: new naver.maps.Point(15, 48)
                }
            });

            // 정보창의 내용 생성
            var contentString = [
                '<div class="iw_inner">',
                '   <h3>' + markerInfo.name + '</h3>',
                '   <div><span class="label"><strong>업종</strong></span> <span class="value">' + markerInfo.category + '</span></div>',
                '   <div><span class="label"><strong>주소</strong></span> <span id="address' + i + '" class="value">' + markerInfo.address + '</span>',
                '       <span class="copy" onclick="copyToClipboard(\'address' + i + '\')">복사</span></div>',
                '   <div><span class="label"><strong>전화번호</strong></span> <span class="value">' + markerInfo.tel + '</span></div>',
                '   <div><span class="label"><strong>플레이스</strong></span> <span class="value"><a href="' + markerInfo.website + '" target="_blank">바로가기</a></span></div>',
                '</div>'
            ].join('');
            

            // 정보창 생성
            var infoWindow = new naver.maps.InfoWindow({
                content: contentString
            });

            // 마커에 클릭 이벤트 리스너 등록
            naver.maps.Event.addListener(marker, 'click', () => {
                // 이전에 열려 있는 정보창이 있으면 닫기
                if (currentInfoWindow) {
                    currentInfoWindow.close();
                }

                // 새 정보창 열기
                infoWindow.open(map, marker);

                // 새 정보창을 currentInfoWindow로 설정
                currentInfoWindow = infoWindow;
            });
        });

        // 지도를 클릭하면 정보창 닫기
        naver.maps.Event.addListener(map, 'click', function() {
            if (currentInfoWindow) {
                currentInfoWindow.close();
                currentInfoWindow = null;
            }
        });
    });

// 주소 복사 기능
function copyToClipboard(id) {
    var text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(function() {
        alert('주소가 클립보드에 복사되었습니다.');
    }).catch(function(error) {
        alert('복사 실패: ' + error);
    });
}