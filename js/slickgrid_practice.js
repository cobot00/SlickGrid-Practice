(function ($) {

	var RECORD_COUNT = 10;
	var COLUMN_DEFS = [{
			id : "id",
			width : 50,
			sortable : true,
			sortAsc : true,
			editor : Slick.Editors.Text
		}, {
			id : "name",
			width : 150,
			sortable : true,
			sortAsc : true,
			editor : Slick.Editors.Text
		}, {
			id : "explanation",
			width : 250,
			sortable : true,
			sortAsc : false,
			editor : Slick.Editors.LongText
		}
	];

	var OPTIONS = {
		multiColumnSort : false,
		editable : true,
		enableCellNavigation : true,
		enableColumnReorder : false,
		enableAddRow : true,
		autoEdit : false
	};

	var localGrid = null;

	$(function () {
		init();
	});

	function init() {
		var columns = createColumns(COLUMN_DEFS);
        
		var data = [];
		for (var i = 0; i < RECORD_COUNT; i++) {
			data[i] = {
				id : i,
				name : "NAME" + zeroPadding("000", RECORD_COUNT - i),
				explanation : "ID = " + i
			};
		}
        
		localGrid = new Slick.Grid("#grid", data, columns, OPTIONS);

		/* ヘッダー行をクリックした際に発生するソートイベント。
		 * [args]
		 *  multiColumnSort: boolean,
		 *  sortCol: selected column,
		 *  sortAsc: boolean
		 */
		localGrid.onSort.subscribe(function (e, args) {
			var sortCol = args.sortCol;
			var sign = args.sortAsc ? 1 : -1; // for toggle action
			var field = args.sortCol.field;

			data.sort(function (left, right) {
				var leftValue = left[field];
				var rightValue = right[field];
				if (leftValue < rightValue)
					return -1 * sign;
				if (leftValue > rightValue)
					return 1 * sign;
				return 0;
			});
			localGrid.invalidate();
			localGrid.render();
		});

		localGrid.setSelectionModel(new Slick.CellSelectionModel());

        /* 行追加時のイベント */
		localGrid.onAddNewRow.subscribe(function (e, args) {
			var item = args.item;
			localGrid.invalidateRow(data.length);
			data.push(item);
			localGrid.updateRowCount();
			localGrid.render();
		});

		localGrid.init();
	}

	/*----------------------------------------
	 * 以下はユーティリティメソッド。
	 *----------------------------------------*/

	function createColumns(columnDefs) {
		var columns = [];
		for (i = 0; i < columnDefs.length; i++) {
			var columnDef = columnDefs[i];
			columns.push(createColumn(columnDef));
		}

		return columns;
	}

	function createColumn(columnDef) {
		var column = {
			id : columnDef.id,
			name : columnDef.id.toUpperCase(),
			field : columnDef.id,
			width : columnDef.width,
			sortable : columnDef.sortable,
			defaultSortAsc : columnDef.sortAsc,
			editor : columnDef.editor
		};
		return column;
	}

	function zeroPadding(pattern, number) {
		return (pattern + number).slice(-pattern.length);
	}

})(jQuery)
