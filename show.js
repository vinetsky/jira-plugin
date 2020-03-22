let headsCahnge = new MutationObserver(function() {
  if (
    document.getElementById("ghx-column-headers") &&
    document.querySelectorAll(".ghx-columns")
  ) {
    console.log("heads change");
    this.disconnect();
    calculateIssues();
    this.observe(document, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }
});

let waitForHeaders = new MutationObserver(function() {
  if (
    document.getElementById("ghx-column-headers") &&
    document.querySelectorAll(".ghx-columns")
  ) {
    this.disconnect();
    calculateIssues();

    headsCahnge.observe(document, {
      attributes: false,
      childList: true,
      subtree: true
    });
  }
});

waitForHeaders.observe(document, {
  attributes: false,
  childList: true,
  subtree: true
});

function calculateIssues() {
  let allStatusCells = document.querySelectorAll(
    "#ghx-column-headers .ghx-column"
  );
  [].forEach.call(allStatusCells, statusCell => {
    let statusLegend = statusCell.querySelector("h2").innerHTML;
    let currentCol = statusCell.dataset.id;
    columnsOfType = [].filter.call(
      document.querySelectorAll(".ghx-columns .ghx-column"),
      rawColumn => {
        return currentCol == rawColumn.dataset.columnId;
      }
    );

    collectedTypes = columnsOfType.reduce(function(acc, column) {
      if (column.querySelectorAll(".ghx-issue").length) {
        taskTypes = [].map.call(
          column.querySelectorAll(".ghx-issue"),
          currentIssue => ({
            title: currentIssue
              .querySelector(".ghx-type")
              .getAttribute("title"),
            img: currentIssue.querySelector(".ghx-type img").getAttribute("src")
          })
        );
        return acc.concat(taskTypes);
      } else return [];
    }, []);

    filteredTypes = collectedTypes.reduce((acc, item) => {
      if (acc[item.title] === undefined) {
        acc[item.title] = { img: item.img, count: 1 };
      } else {
        acc[item.title].count++;
      }
      return acc;
    }, {});

    let sortedKeys = Object.keys(filteredTypes).sort();

    if (statusCell.querySelectorAll(".taskIcon").length < 1) {
      statusCell.insertAdjacentHTML(
        "beforeend",

        `<style>
        .ghx-column-headers .ghx-column {
          padding: 4px 9px;
          margin-bottom: 12px;
        }
        </style>
        <br>`
      );
      sortedKeys.forEach(function(currentType) {
        statusCell.insertAdjacentHTML(
          "beforeend",
          `<span class="taskIcon" style="white-space: nowrap"><span
          style="display: inline-block;
                color: #172b4d;
                font-size: 10px;
                font-weight: bold;
                line-height: 1.5;
                font-weight: normal;
                margin: 0 1px 0 0;
                word-wrap: break-word;
                vertical-align: bottom;"
        >
          <img src="${filteredTypes[currentType].img}" />
        </span>
        <span class="taskCount"
        style="display: inline-block;
              color: #172b4d;
              font-size: 14px;
              font-weight: bold;
              line-height: 1.1;
              font-weight: normal;
              margin: 0 5px 0 0;
              word-wrap: break-word;"
      >
        ${filteredTypes[currentType].count}
      </span>`
        );
      });
    }
  });
}
