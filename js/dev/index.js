(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function preloader() {
  const preloaderImages = document.querySelectorAll("img");
  const htmlDocument = document.documentElement;
  const isPreloaded = localStorage.getItem(location.href) && document.querySelector('[data-fls-preloader="true"]');
  if (preloaderImages.length && !isPreloaded) {
    let setValueProgress2 = function(progress2) {
      showPecentLoad ? showPecentLoad.innerText = `${progress2}%` : null;
      showLineLoad ? showLineLoad.style.width = `${progress2}%` : null;
    }, imageLoaded2 = function() {
      imagesLoadedCount++;
      progress = Math.round(100 / preloaderImages.length * imagesLoadedCount);
      const intervalId = setInterval(() => {
        counter >= progress ? clearInterval(intervalId) : setValueProgress2(++counter);
        counter >= 100 ? addLoadedClass() : null;
      }, 10);
    };
    var setValueProgress = setValueProgress2, imageLoaded = imageLoaded2;
    const preloaderTemplate = `
					<div class="preloader">
						<div class="preloader__body">
							<div class="preloader__logo">
                <svg width="332" height="82" viewBox="0 0 332 82" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_57_11049)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.3702 0.0488208L20.3722 0.096665L21.7714 5.11553L23.1706 10.1346L22.535 15.5456L21.8993 20.9568L21.2779 22.1498L20.6567 23.3427L19.9323 23.633L19.2079 23.9231L18.9716 23.9174L18.7352 23.9114L17.0839 20.9989L15.4324 18.0861L14.879 11.4358L14.3254 4.7854H14.2059H14.0866L11.511 12.2013L8.93565 19.6171L8.83957 24.6697L8.7435 29.722L7.60771 27.636L6.47211 25.5498L5.50752 23.8354L4.54274 22.1213L4.3994 22.5915L4.25606 23.0619L2.96616 27.942L1.67627 32.8221L0.838501 35.4673L0.000732422 38.1127V39.5173V40.922L0.288571 42.422L0.57641 43.922L1.27967 46.167L1.98294 48.4123L1.42417 49.7075L0.865402 51.0029V51.1333V51.2634L9.31995 58.8327L17.7745 66.4019L24.7084 66.4053L31.6423 66.4088L39.696 59.2157L47.7497 52.0226L48.2212 51.565L48.693 51.1074L48.0696 49.8112L47.4463 48.515L48.5139 43.7698L49.5814 39.0245L47.6492 30.8519L45.717 22.6791L45.6165 22.3934L45.5162 22.1075L45.1918 22.5174L44.8675 22.9274L42.4821 26.0093L40.0968 29.0912L40.0474 29.042L39.998 28.9929L40.4932 27.5585L40.9882 26.1239L39.3188 18.5743L37.6494 11.0245L37.6075 10.9833L37.5658 10.9422L29.0409 5.47149L20.5163 0.000976562H20.4423H20.3685L20.3702 0.0488208ZM19.5227 33.8747L24.4088 35.7885H24.7309H25.0531L29.9469 33.8669L34.8408 31.9452L34.9904 32.0966L35.1399 32.248L36.6612 35.7885L38.1824 39.3289L38.3102 39.731L38.4382 40.1329L35.5041 41.2465L32.5699 42.3602L32.4393 42.4712L32.3086 42.5824L35.1774 46.4063L38.0462 50.23L38.0452 50.4252L38.0443 50.6202L37.6129 51.1568L37.1815 51.6934L30.9717 53.4838L24.7616 55.2743L18.59 53.4736L12.4183 51.6728H12.3811H12.3438L11.8348 51.0079L11.3256 50.3431L14.2124 46.4709L17.0995 42.599L16.9565 42.4691L16.8137 42.3393L13.9363 41.2536L11.0591 40.1679L11.0105 40.1195L10.9619 40.0711L12.5117 36.4466L14.0616 32.8221L14.232 32.3915L14.4023 31.9609H14.5195H14.6367L19.5227 33.8747ZM15.1805 37.8814L18.779 39.0358L22.5782 40.2858L23.0743 39.1079L19.5321 37.5438L15.99 35.9798H15.8916H15.7931L15.1805 37.8814ZM29.8145 37.5088L26.1842 39.1079L26.6133 40.2858L30.4021 39.1242L34.1071 37.8999L33.6364 35.9798L33.4875 35.9925L33.3385 36.0051L29.8145 37.5088ZM20.8929 43.8129L20.7958 44.1821L21.4468 45.1449L22.0978 46.1077V46.4949V46.8818L23.0661 47.3706L24.0345 47.8594L23.9788 46.1923L23.9233 44.5252L22.597 43.9844L21.2708 43.4436H21.1304H20.9897L20.8929 43.8129ZM26.7094 44.023L25.4604 44.5643L25.4051 46.1971L25.3496 47.8301L26.3658 47.3848L27.3819 46.9394L27.4461 46.4001L27.5103 45.8608L28.1432 45.0829L28.7762 44.3047L28.5781 43.8741L28.3799 43.4436L28.1692 43.4629L27.9584 43.482L26.7094 44.023ZM19.8368 56.1697L24.7816 57.6738L30.1848 56.0966L35.5882 54.5195L35.6447 54.5792L35.7012 54.6391L33.6552 56.9683L31.6092 59.2976L24.7633 59.3127L17.9176 59.3278L16.298 57.1748L14.6786 55.0219L14.5137 54.7501L14.3489 54.4783L14.6206 54.5719L14.8923 54.6657L19.8368 56.1697Z" fill="#CCFF00"></path>
      </g>
      <path d="M91.0267 49.9154L90.328 49.9154C76.0051 49.9154 71.5073 40.964 71.5073 33.6718L71.5073 32.4929C71.5073 25.5938 75.6994 16.5114 90.5027 16.5114L91.9874 16.5114C106.136 16.5114 110.633 22.6682 110.633 28.039L110.633 28.1264L101.332 28.1263C100.983 27.2967 99.7165 23.8471 91.2887 23.8471C83.2975 23.8471 80.8522 28.3447 80.8522 32.7112L80.8522 33.2789C80.8522 37.5144 83.5595 42.5796 91.5943 42.5796C99.2798 42.5796 100.983 38.475 101.114 37.5144L92.293 37.5144L92.293 31.7069L111.026 31.7069L111.026 49.4351L103.865 49.4351C103.734 48.2561 103.254 45.9855 102.773 44.9375C102.075 45.8545 98.6685 49.9154 91.0267 49.9154Z" fill="#CCFF00"></path>
      <path d="M136.366 16.3776L138.287 16.3776C153.484 16.3776 157.807 25.2853 157.807 32.4028L157.807 33.7127C157.807 40.6992 153.484 49.9126 138.287 49.9126L136.366 49.9126C121.17 49.9126 116.847 40.6992 116.847 33.7127L116.847 32.4028C116.847 25.329 121.17 16.3776 136.366 16.3776ZM148.462 33.3634L148.462 32.7521C148.462 28.7349 146.497 23.8007 137.327 23.8007C128.244 23.8007 126.192 28.7349 126.192 32.7521L126.192 33.3634C126.192 37.2933 128.375 42.4458 137.327 42.4458C146.453 42.4458 148.462 37.2933 148.462 33.3634Z" fill="#CCFF00"></path>
      <path d="M172.716 24.5832L172.716 31.4824L185.248 31.4824C188.916 31.4824 189.921 29.9104 189.921 28.0328L189.921 27.9455C189.921 26.0679 188.916 24.5832 185.248 24.5832L172.716 24.5832ZM192.497 34.277C196.907 35.2813 199.571 37.9449 199.571 42.7044L199.571 46.0666C199.571 48.5119 199.79 49.1669 200.095 49.6909L200.095 49.9092L190.794 49.9092C190.663 49.6909 190.488 49.0795 190.488 47.6386L190.488 44.975C190.488 40.7831 188.96 38.8618 184.419 38.8618L172.716 38.8618L172.716 49.9092L163.72 49.9092L163.72 17.4221L185.598 17.4221C197.955 17.4221 199.353 22.5746 199.353 26.1115L199.353 26.5482C199.353 30.6091 196.558 33.36 192.497 34.277Z" fill="#CCFF00"></path>
      <path d="M215.005 17.4221L215.005 49.9092L206.009 49.9092L206.009 17.4221L215.005 17.4221Z" fill="#CCFF00"></path>
      <path d="M220.917 17.4221L229.913 17.4221L229.913 42.2677L249.782 42.2677L249.782 49.9092L220.917 49.9092L220.917 17.4221Z" fill="#CCFF00"></path>
      <path d="M255.694 17.4221L264.69 17.4221L264.69 42.2677L284.559 42.2677L284.559 49.9092L255.694 49.9092L255.694 17.4221Z" fill="#CCFF00"></path>
      <path d="M316.672 37.2025L310.777 23.9719L305.057 37.2025L316.672 37.2025ZM322.349 49.9092L319.685 43.8834L302.131 43.8834L299.511 49.9092L290.472 49.9092L304.882 17.4221L316.934 17.4221L332 49.9092L322.349 49.9092Z" fill="#CCFF00"></path>
      <path d="M73.814 69.7279H78.4577C79.015 69.7279 79.5155 69.764 79.9592 69.8362C80.4029 69.9085 80.7796 70.0426 81.0892 70.2387C81.3988 70.4244 81.6361 70.6876 81.8012 71.0281C81.9663 71.3583 82.0489 71.7865 82.0489 72.3128C82.0489 72.6224 82.0025 72.9268 81.9096 73.226C81.8167 73.515 81.6774 73.7781 81.4916 74.0154C81.3162 74.2424 81.0995 74.4333 80.8415 74.5881C80.5939 74.7429 80.3049 74.8409 79.9747 74.8822V74.9132C80.501 75.0576 80.9034 75.3363 81.1821 75.749C81.471 76.1515 81.6155 76.621 81.6155 77.1576C81.6155 77.7561 81.4968 78.2823 81.2595 78.7364C81.0324 79.1904 80.7228 79.567 80.3307 79.8663C79.9386 80.1655 79.4897 80.3926 78.984 80.5473C78.4784 80.7021 77.9469 80.7795 77.3897 80.7795H71.5076L73.814 69.7279ZM77.2813 78.8911C77.8386 78.8911 78.2926 78.7415 78.6435 78.4423C79.0047 78.143 79.1852 77.6993 79.1852 77.1111C79.1852 76.8222 79.1233 76.5952 78.9995 76.4301C78.886 76.265 78.7364 76.1411 78.5506 76.0586C78.3649 75.9657 78.1585 75.909 77.9314 75.8883C77.7044 75.8677 77.4825 75.8574 77.2658 75.8574H74.882L74.2319 78.8911H77.2813ZM77.9779 74.2012C78.4216 74.2012 78.8034 74.0825 79.1233 73.8452C79.4536 73.5975 79.6187 73.2312 79.6187 72.7462C79.6187 72.3128 79.5 72.0187 79.2626 71.8639C79.0356 71.6988 78.726 71.6163 78.3339 71.6163H75.7643L75.2226 74.2012H77.9779Z" fill="white"></path>
      <path d="M85.7744 69.7279H88.1737L86.5484 77.3897L92.3686 69.7279H95.1703L92.8329 80.7795H90.4337L92.059 73.1022L86.2388 80.7795H83.4525L85.7744 69.7279Z" fill="white"></path>
      <path d="M98.0822 69.7279H107.277L104.939 80.7795H102.509L104.413 71.7711H100.079L98.1751 80.7795H95.7603L98.0822 69.7279Z" fill="white"></path>
      <path d="M109.683 80.9653C109.445 80.9653 109.177 80.9446 108.878 80.9033C108.578 80.8724 108.357 80.8311 108.212 80.7795L108.646 78.8292C108.78 78.8602 108.924 78.886 109.079 78.9066C109.244 78.9273 109.44 78.9376 109.667 78.9376C110.07 78.9376 110.42 78.8189 110.72 78.5816C111.019 78.3442 111.169 78.0295 111.169 77.6374C111.169 77.4516 111.143 77.2711 111.091 77.0956C111.04 76.9202 110.988 76.7448 110.936 76.5694L108.924 69.7279H111.525L112.98 75.6097L116.323 69.7279H119.109L113.8 78.1482C113.46 78.6848 113.135 79.1336 112.825 79.4948C112.526 79.856 112.216 80.1449 111.896 80.3616C111.576 80.5783 111.236 80.7331 110.875 80.826C110.524 80.9188 110.126 80.9653 109.683 80.9653Z" fill="white"></path>
      <path d="M123.891 81.0272C122.313 81.0272 121.1 80.6144 120.254 79.7889C119.408 78.9531 118.985 77.7406 118.985 76.1515C118.985 75.2537 119.124 74.4024 119.402 73.5975C119.681 72.7926 120.078 72.0858 120.594 71.477C121.121 70.8578 121.755 70.3677 122.498 70.0065C123.252 69.6453 124.093 69.4648 125.021 69.4648C125.661 69.4648 126.255 69.5525 126.802 69.7279C127.348 69.9033 127.818 70.1665 128.21 70.5173C128.613 70.8578 128.922 71.2861 129.139 71.802C129.356 72.3076 129.459 72.8958 129.448 73.5666H127.018C127.018 72.8855 126.833 72.3747 126.461 72.0342C126.1 71.6833 125.625 71.5079 125.037 71.5079C124.418 71.5079 123.876 71.6524 123.412 71.9413C122.958 72.2199 122.581 72.5862 122.282 73.0403C121.993 73.484 121.776 73.9845 121.631 74.5417C121.487 75.0886 121.415 75.6252 121.415 76.1515C121.415 76.5333 121.461 76.8944 121.554 77.2349C121.657 77.5755 121.807 77.8799 122.003 78.1482C122.209 78.4062 122.467 78.6125 122.777 78.7673C123.097 78.9221 123.479 78.9995 123.922 78.9995C124.253 78.9995 124.562 78.9427 124.851 78.8292C125.15 78.7054 125.414 78.5455 125.641 78.3494C125.868 78.143 126.059 77.9057 126.213 77.6374C126.368 77.3691 126.471 77.0905 126.523 76.8016H128.953C128.705 77.5755 128.411 78.2307 128.071 78.7673C127.741 79.3039 127.364 79.7425 126.941 80.083C126.528 80.4132 126.064 80.6505 125.548 80.795C125.042 80.9498 124.49 81.0272 123.891 81.0272Z" fill="white"></path>
      <path d="M132.904 69.7279H135.334L134.374 74.356H134.405L139.42 69.7279H142.64L137.331 74.2786L140.721 80.7795H137.981L135.458 75.8109L133.77 77.2814L133.043 80.7795H130.613L132.904 69.7279Z" fill="white"></path>
      <path d="M147.944 69.7279H150.437L152.279 80.7795H149.864L149.508 78.3184H145.375L143.982 80.7795H141.428L147.944 69.7279ZM149.291 76.5075L148.749 72.1116H148.718L146.335 76.5075H149.291Z" fill="white"></path>
      <path d="M153.928 80.7795L156.25 69.7279H158.649L157.024 77.3897L162.844 69.7279H165.646L163.309 80.7795H160.909L162.535 73.1022L156.714 80.7795H153.928ZM160.971 68.7837C160.321 68.7837 159.785 68.6392 159.361 68.3503C158.949 68.0511 158.742 67.597 158.742 66.9882C158.742 66.7921 158.763 66.5961 158.804 66.4H159.671C159.661 66.7612 159.785 67.0346 160.043 67.2204C160.311 67.4061 160.662 67.499 161.095 67.499C161.529 67.499 161.915 67.4061 162.256 67.2204C162.597 67.0346 162.839 66.7612 162.984 66.4H163.85C163.675 67.2049 163.34 67.8034 162.844 68.1955C162.349 68.5876 161.725 68.7837 160.971 68.7837Z" fill="white"></path>
      <path d="M173.64 69.7279H181.318L180.884 71.7711H175.637L173.733 80.7795H171.318L173.64 69.7279Z" fill="white"></path>
      <path d="M186.507 81.0272C184.928 81.0272 183.715 80.6144 182.869 79.7889C182.023 78.9531 181.6 77.7406 181.6 76.1515C181.6 75.2537 181.739 74.4024 182.018 73.5975C182.296 72.7926 182.694 72.0858 183.21 71.477C183.736 70.8578 184.37 70.3677 185.113 70.0065C185.867 69.6453 186.708 69.4648 187.637 69.4648C188.38 69.4648 189.056 69.5679 189.664 69.7743C190.273 69.9704 190.789 70.2696 191.212 70.6721C191.635 71.0745 191.96 71.5698 192.187 72.158C192.425 72.7462 192.543 73.4272 192.543 74.2012C192.543 75.1092 192.409 75.976 192.141 76.8016C191.873 77.6271 191.481 78.3546 190.965 78.984C190.459 79.6135 189.829 80.1139 189.076 80.4854C188.333 80.8466 187.477 81.0272 186.507 81.0272ZM186.538 78.9995C187.136 78.9995 187.657 78.8602 188.101 78.5816C188.545 78.2926 188.916 77.9263 189.215 77.4826C189.515 77.0286 189.737 76.5281 189.881 75.9812C190.036 75.4343 190.113 74.8977 190.113 74.3714C190.113 73.9793 190.067 73.613 189.974 73.2725C189.891 72.9216 189.752 72.6172 189.556 72.3592C189.36 72.1013 189.107 71.8949 188.798 71.7401C188.488 71.5853 188.106 71.5079 187.652 71.5079C187.033 71.5079 186.491 71.6524 186.027 71.9413C185.573 72.2199 185.196 72.5862 184.897 73.0403C184.608 73.484 184.391 73.9845 184.247 74.5417C184.102 75.0886 184.03 75.6252 184.03 76.1515C184.03 76.5333 184.076 76.8944 184.169 77.2349C184.272 77.5755 184.422 77.8799 184.618 78.1482C184.825 78.4062 185.083 78.6125 185.392 78.7673C185.712 78.9221 186.094 78.9995 186.538 78.9995Z" fill="white"></path>
      <path d="M196.093 69.7279H200.52C201.077 69.7279 201.588 69.7846 202.053 69.8982C202.527 70.0013 202.935 70.1768 203.276 70.4244C203.616 70.6721 203.879 71.0023 204.065 71.415C204.261 71.8278 204.359 72.3386 204.359 72.9474C204.359 73.5562 204.24 74.1031 204.003 74.5881C203.776 75.0628 203.461 75.4652 203.059 75.7955C202.667 76.1257 202.213 76.3785 201.697 76.5539C201.181 76.7293 200.634 76.817 200.056 76.817H197.053L196.217 80.7795H193.802L196.093 69.7279ZM199.932 74.9287C200.551 74.9287 201.036 74.7739 201.387 74.4643C201.748 74.1444 201.929 73.6543 201.929 72.9938C201.929 72.7152 201.877 72.4882 201.774 72.3128C201.681 72.1271 201.552 71.9877 201.387 71.8949C201.222 71.7917 201.036 71.7195 200.83 71.6782C200.634 71.6369 200.427 71.6163 200.211 71.6163H198.136L197.455 74.9287H199.932Z" fill="white"></path>
      <path d="M207.223 69.7279H209.622L207.997 77.3897L213.817 69.7279H216.618L214.281 80.7795H211.882L213.507 73.1022L207.687 80.7795H204.901L207.223 69.7279Z" fill="white"></path>
      <path d="M217.626 80.9033C217.523 80.9033 217.399 80.8982 217.255 80.8879C217.11 80.8775 216.966 80.8621 216.822 80.8414C216.667 80.8311 216.522 80.8156 216.388 80.795C216.254 80.7744 216.151 80.7486 216.079 80.7176L216.481 78.8602C216.522 78.8705 216.584 78.886 216.667 78.9066C216.749 78.9169 216.837 78.9273 216.93 78.9376C217.023 78.9376 217.11 78.9427 217.193 78.9531C217.276 78.9531 217.337 78.9531 217.379 78.9531C217.461 78.9531 217.559 78.9427 217.673 78.9221C217.797 78.9015 217.926 78.855 218.06 78.7828C218.204 78.7002 218.344 78.5816 218.478 78.4268C218.622 78.272 218.751 78.0605 218.865 77.7922C219.009 77.4826 219.149 77.0956 219.283 76.6313C219.427 76.1566 219.582 75.5891 219.747 74.9287C219.912 74.2682 220.088 73.5098 220.273 72.6533C220.469 71.7968 220.681 70.8217 220.908 69.7279H228.864L226.511 80.7795H224.097L226.016 71.7711H222.781C222.554 72.7514 222.353 73.613 222.177 74.356C222.012 75.0886 221.857 75.7284 221.713 76.2753C221.568 76.8222 221.429 77.2917 221.295 77.6838C221.171 78.0759 221.037 78.4216 220.893 78.7209C220.748 79.0098 220.588 79.2678 220.413 79.4948C220.248 79.7115 220.057 79.923 219.84 80.1294C219.52 80.4287 219.174 80.6351 218.803 80.7486C218.431 80.8517 218.039 80.9033 217.626 80.9033Z" fill="white"></path>
      <path d="M231.297 80.9653C231.06 80.9653 230.791 80.9446 230.492 80.9033C230.193 80.8724 229.971 80.8311 229.827 80.7795L230.26 78.8292C230.394 78.8602 230.539 78.886 230.693 78.9066C230.859 78.9273 231.055 78.9376 231.282 78.9376C231.684 78.9376 232.035 78.8189 232.334 78.5816C232.633 78.3442 232.783 78.0295 232.783 77.6374C232.783 77.4516 232.757 77.2711 232.706 77.0956C232.654 76.9202 232.603 76.7448 232.551 76.5694L230.539 69.7279H233.139L234.594 75.6097L237.938 69.7279H240.724L235.415 78.1482C235.074 78.6848 234.749 79.1336 234.439 79.4948C234.14 79.856 233.831 80.1449 233.511 80.3616C233.191 80.5783 232.85 80.7331 232.489 80.826C232.138 80.9188 231.741 80.9653 231.297 80.9653Z" fill="white"></path>
      <defs>
        <clipPath id="clip0_57_11049">
          <rect width="49.5807" height="66.4078" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>  
              </div>
						</div>
					</div>`;
    document.body.insertAdjacentHTML("beforeend", preloaderTemplate);
    document.querySelector(".preloader");
    const showPecentLoad = document.querySelector(".preloader__counter"), showLineLoad = document.querySelector(".preloader__line span");
    let imagesLoadedCount = 0;
    let counter = 0;
    let progress = 0;
    htmlDocument.setAttribute("data-fls-preloader-loading", "");
    htmlDocument.setAttribute("data-fls-scrolllock", "");
    preloaderImages.forEach((preloaderImage) => {
      const imgClone = document.createElement("img");
      if (imgClone) {
        imgClone.onload = imageLoaded2;
        imgClone.onerror = imageLoaded2;
        preloaderImage.dataset.src ? imgClone.src = preloaderImage.dataset.src : imgClone.src = preloaderImage.src;
      }
    });
    setValueProgress2(progress);
    const preloaderOnce = () => localStorage.setItem(location.href, "preloaded");
    document.querySelector('[data-fls-preloader="true"]') ? preloaderOnce() : null;
  } else {
    addLoadedClass();
  }
  function addLoadedClass() {
    htmlDocument.setAttribute("data-fls-preloader-loaded", "");
    htmlDocument.removeAttribute("data-fls-preloader-loading");
    htmlDocument.removeAttribute("data-fls-scrolllock");
  }
}
document.addEventListener("DOMContentLoaded", preloader);
function setVh() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
}
window.addEventListener("resize", setVh);
setVh();
(function() {
  let baranClicked = false;
  const performanceMetrics = {
    startTime: performance.now(),
    markPageLoadStart() {
      performance.mark("pageLoadStart");
    },
    markPageLoadEnd() {
      performance.mark("pageLoadEnd");
      performance.measure("pageLoad", "pageLoadStart", "pageLoadEnd");
      const measures = performance.getEntriesByName("pageLoad");
      console.log(`Page load time: ${measures[0].duration.toFixed(2)}ms`);
    },
    trackResourceLoadTimes() {
      const resources = performance.getEntriesByType("resource");
      const slowResources = resources.filter(
        (resource) => resource.responseEnd - resource.startTime > 200
      );
      if (slowResources.length) {
        console.warn("Slow resources detected:", slowResources.map((r) => r.name));
      }
    }
  };
  function initializePageScripts() {
    performanceMetrics.markPageLoadStart();
    const formToggleButtons = document.querySelectorAll(".button-goto-form");
    const popup3 = document.querySelector(".popup3");
    formToggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        baranClicked = true;
        document.documentElement.classList.toggle("show-form");
        if (!baranClicked) return;
        if (popup3) {
          popup2.classList.remove("popup_show");
          document.documentElement.classList.add("popup-show");
          document.documentElement.classList.add("popup-show");
          popup3.classList.add("popup_show");
          popup3.style.animation = "popupAppear 0.5s forwards";
        }
      });
    });
    const gameRoulette = new GameRoulette();
    const resetButton = document.querySelector(".reset-button");
    if (resetButton) {
      resetButton.addEventListener("click", () => gameRoulette.resetGame());
    }
    performanceMetrics.markPageLoadEnd();
    performanceMetrics.trackResourceLoadTimes();
  }
  function moveElements() {
    const isMobile = window.innerWidth <= 550;
    const pageCounter = document.querySelector(".page__counter");
    const rouletteCounter = document.querySelector(".game__roulette-counter");
    const pageLogo = document.querySelector(".page__game-logo");
    const rouletteLogo = document.querySelector(".game__roulette-game-logo");
    if (!pageCounter || !rouletteCounter || !pageLogo || !rouletteLogo) {
      return;
    }
    if (isMobile) {
      if (pageCounter.parentElement !== rouletteCounter) {
        rouletteCounter.appendChild(pageCounter);
      }
      if (pageLogo.parentElement !== rouletteLogo) {
        rouletteLogo.appendChild(pageLogo);
      }
    } else {
      const originalCounterContainer = document.querySelector(".page__counter-container");
      const originalLogoContainer = document.querySelector(".page__logo-container");
      if (originalCounterContainer && pageCounter.parentElement !== originalCounterContainer) {
        originalCounterContainer.appendChild(pageCounter);
      }
      if (originalLogoContainer && pageLogo.parentElement !== originalLogoContainer) {
        originalLogoContainer.appendChild(pageLogo);
      }
    }
  }
  function initMarquee(selector, speed = 60) {
    const container = document.querySelector(selector);
    if (!container || !container.children.length) {
      console.warn(`No valid container found for selector: ${selector}`);
      return;
    }
    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      display: "flex",
      whiteSpace: "nowrap",
      willChange: "transform"
    });
    const originalLines = Array.from(container.children);
    originalLines.forEach((line) => {
      line.style.flex = "0 0 auto";
      wrapper.appendChild(line.cloneNode(true));
      wrapper.appendChild(line.cloneNode(true));
    });
    container.innerHTML = "";
    container.appendChild(wrapper);
    const marqueeSpeed = typeof speed === "number" && speed > 0 ? speed : 60;
    let offset = 0;
    let lastTime = performance.now();
    let animationFrame;
    function animate(now) {
      const dt = (now - lastTime) / 1e3;
      lastTime = now;
      offset += marqueeSpeed * dt;
      const totalWidth = wrapper.offsetWidth / 2;
      if (offset >= totalWidth) offset -= totalWidth;
      wrapper.style.transform = `translateX(-${offset}px)`;
      animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    container.addEventListener("mouseenter", () => cancelAnimationFrame(animationFrame));
    container.addEventListener("mouseleave", () => {
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(animate);
    });
  }
  function safeInitialize() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializePageScripts);
    } else {
      requestAnimationFrame(initializePageScripts);
    }
    requestAnimationFrame(() => initMarquee(".page__marquee.marquee-row", 60));
  }
  safeInitialize();
  window.addEventListener("resize", moveElements());
  document.addEventListener("DOMContentLoaded", moveElements());
})();
const initialUrl = window.location.href;
const queryParams = getQueryParams(initialUrl);
function getQueryParams(url) {
  const queryString = url.split("?")[1];
  if (!queryString) return {};
  const params = new URLSearchParams(queryString);
  const paramsObj = {};
  for (const [key, value] of params.entries()) {
    paramsObj[key] = value;
  }
  return paramsObj;
}
function appendQueryParamsToLinks() {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", function(event) {
      event.preventDefault();
      const newUrl = new URL(link.href);
      for (const key in queryParams) {
        newUrl.searchParams.set(key, queryParams[key]);
      }
      link.href = newUrl.toString();
      window.location.href = link.href;
    });
  });
}
appendQueryParamsToLinks();
